import { Inject, Injectable } from '@nestjs/common';

import { APP_CONFIG, IConfig } from '@/config/types';
import { IRadarrMovie, RadarrClientService } from '@lib/radarr-client';

@Injectable()
export class MovieService {
  constructor(
    @Inject(APP_CONFIG) private readonly config: IConfig,
    private readonly radarrClientService: RadarrClientService,
  ) {}
  async searchMovies(title: string): Promise<IRadarrMovie[]> {
    const movies = await this.radarrClientService.getMovieLookup(title);

    return movies.slice(0, 5);
  }

  async getMovie(tmdbId: number): Promise<IRadarrMovie> {
    const movie = await this.radarrClientService.getMovie(tmdbId);

    if (!movie.remotePoster) {
      movie.remotePoster = movie.images.find(
        (image) => image.coverType === 'poster',
      )?.url;
    }

    return movie;
  }

  async addMovie(tmdbId: number): Promise<void> {
    const movie = await this.getMovie(tmdbId);

    await this.radarrClientService.postMovie({
      ...movie,
      monitored: true,
      addOptions: {
        addMethod: 'manual',
        monitor: 'movieOnly',
        searchForMovie: true,
      },
      rootFolderPath: this.config.radarr.rootFolderPath,
      qualityProfileId: this.config.radarr.qualityProfileId,
    });
  }
}
