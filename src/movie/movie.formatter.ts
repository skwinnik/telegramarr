import { InlineKeyboardMarkup } from '@grammyjs/types/markup';
import { ParseMode } from '@grammyjs/types/message';

import { IRadarrMovie } from '@lib/radarr-client';

type TelegramResponse = {
  text: string;
  other?: {
    reply_markup?: InlineKeyboardMarkup;
    parse_mode?: ParseMode;
  };
};

export function searchMovieResponse(
  movies: IRadarrMovie[],
  callbackDataFactory: (movie: IRadarrMovie) => string,
): TelegramResponse {
  if (movies.length === 0) {
    return {
      text: 'No movies found',
      other: undefined,
    };
  }

  return {
    text: 'Select a movie',
    other: {
      reply_markup: {
        inline_keyboard: movies.map((movie) => [
          {
            text: `${movie.title} (${movie.year})`,
            callback_data: callbackDataFactory(movie),
          },
        ]),
      },
    },
  };
}

export function viewMovieResponse(
  movie: IRadarrMovie,
  backCallbackDataFactory: () => string,
  addCallbackDataFactory: (movie: IRadarrMovie) => string,
): TelegramResponse {
  return {
    text: `<b>${movie.title}</b> (${movie.year})\n\n${movie.overview}\n\nhttps://www.themoviedb.org/movie/${movie.tmdbId}`,
    other: {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Back',
              callback_data: backCallbackDataFactory(),
            },
            {
              text: 'Add',
              callback_data: addCallbackDataFactory(movie),
            },
          ],
        ],
      },
    },
  };
}

export function addMovieResponse(
  movie: IRadarrMovie,
  callbackDataFactory: () => string,
): TelegramResponse {
  const viewResponse = viewMovieResponse(
    movie,
    () => '',
    () => '',
  );

  viewResponse.other = {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Done',
            callback_data: callbackDataFactory(),
          },
        ],
      ],
    },
  };

  return viewResponse;
}
