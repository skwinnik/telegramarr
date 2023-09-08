import { Inject, Injectable } from '@nestjs/common';

import { RadarrErrorFactory } from '@lib/radarr-client/errors';
import {
  IRadarrClientModuleConfig,
  MODULE_OPTIONS_TOKEN,
} from '@lib/radarr-client/radarr-client.module-definition';
import { IPostRadarrMovie, IRadarrMovie } from '@lib/radarr-client/types';

@Injectable()
export class RadarrClientService {
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
      throw await RadarrErrorFactory.fromResponse(response);
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
      throw await RadarrErrorFactory.fromResponse(response);
    }

    return (await response.json()) as Promise<T>;
  }
}
