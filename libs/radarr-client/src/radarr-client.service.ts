import { RadarrErrorFactory } from '@app/radarr-client/errors';
import {
  IRadarrClientModuleConfig,
  MODULE_OPTIONS_TOKEN,
} from '@app/radarr-client/radarr-client.module-definition';
import { IPostRadarrMovie, IRadarrMovie } from '@app/radarr-client/types';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RadarrClientService {
  private readonly logger = new Logger(RadarrClientService.name);
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly config: IRadarrClientModuleConfig,
  ) {}

  public getMovieLookup(title: string) {
    return this._get<IRadarrMovie[]>(`/api/v3/movie/lookup?term=${title}`);
  }

  public getMovie(tmdbId: number) {
    return this._get<IRadarrMovie>(
      `/api/v3/movie/lookup/tmdb?tmdbId=${tmdbId}`,
    );
  }

  public postMovie(movie: IPostRadarrMovie) {
    return this._post<IPostRadarrMovie>(`/api/v3/movie`, {
      body: JSON.stringify(movie),
    });
  }

  private async _get<T>(url: string, init?: RequestInit) {
    const response = await fetch(new URL(this.config.baseUrl + url), {
      headers: {
        'X-Api-Key': this.config.apiKey,
        contentType: 'application/json',
      },
      ...init,
    });

    if (!response.ok) {
      const error = await RadarrErrorFactory.fromResponse(response);
      throw error;
    }

    return (await response.json()) as Promise<T>;
  }

  private async _post<T>(url: string, init?: RequestInit) {
    const response = await fetch(new URL(this.config.baseUrl + url), {
      headers: {
        'X-Api-Key': this.config.apiKey,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      ...init,
    });

    if (!response.ok) {
      const error = await RadarrErrorFactory.fromResponse(response);
      throw error;
    }

    return (await response.json()) as Promise<T>;
  }
}
