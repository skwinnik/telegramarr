import { BotController, CallbackQuery } from '@app/nest-grammy';
import { Command } from '@app/nest-grammy/decorators/command.decorator';
import { RadarrError, RadarrValidationError } from '@app/radarr-client/errors';
import { Logger } from '@nestjs/common';
import { CallbackQueryContext, CommandContext, Context } from 'grammy';

import {
  addMovieResponse,
  searchMovieResponse,
  viewMovieResponse,
} from '@/movie/movie.formatter';
import { MovieService } from '@/movie/movie.service';

@BotController({
  name: 'main',
})
export class MovieController {
  private readonly logger = new Logger(MovieController.name);

  constructor(private readonly movieService: MovieService) {}

  @Command('movie')
  @CallbackQuery(new RegExp('search_movie:(?<query>.+)'))
  async movie(
    context: CommandContext<Context> | CallbackQueryContext<Context>,
  ) {
    let query: string;
    if (typeof context.match === 'string') query = context.match;
    else query = context.match.groups!['query'];

    if (query.length === 0) {
      await context.reply('Please enter a search query: /movie <query>');
      return;
    }

    const movies = await this.movieService.searchMovies(query);
    const { text, other } = searchMovieResponse(
      movies,
      (movie) => `view_movie:${movie.tmdbId}:${query}`,
    );

    if (context.callbackQuery) {
      await context.editMessageText(text, other);
      return await context.answerCallbackQuery();
    }

    await context.reply(text, other);
  }

  @CallbackQuery(new RegExp('view_movie:(?<tmdbId>\\d+):(?<query>.+)'))
  async viewMovie(context: CallbackQueryContext<Context>) {
    if (typeof context.match === 'string') return;
    const tmdbId = Number(context.match.groups!['tmdbId']);
    const query = context.match.groups!['query'];

    const movie = await this.movieService.getMovie(tmdbId);

    const { text, other } = viewMovieResponse(
      movie,
      () => `search_movie:${query}`,
      (movie) => `add_movie:${movie.tmdbId}`,
    );

    await context.editMessageText(text, other);
    await context.answerCallbackQuery();
  }

  @CallbackQuery(new RegExp('add_movie:(?<tmdbId>\\d+)'))
  async addMovie(context: CallbackQueryContext<Context>) {
    if (typeof context.match === 'string') return;
    const tmdbId = Number(context.match.groups!['tmdbId']);

    try {
      await this.movieService.addMovie(tmdbId);
      const movie = await this.movieService.getMovie(tmdbId);
      const { text, other } = addMovieResponse(movie, () => 'done_movie');

      await context.editMessageText(text, other);
    } catch (e: unknown) {
      if (e instanceof RadarrValidationError) {
        const movie = await this.movieService.getMovie(tmdbId);

        const { text, other } = addMovieResponse(movie, () => 'done_movie');
        await context.editMessageText(text, other);
      }
    }

    await context.answerCallbackQuery();
  }

  @CallbackQuery('done_movie')
  async doneMovie(context: CallbackQueryContext<Context>) {
    await context.answerCallbackQuery('Movie added');
  }
}
