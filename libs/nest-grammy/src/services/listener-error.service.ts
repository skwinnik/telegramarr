import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { Bot, BotError } from 'grammy';

import { BOT_INSTANCE } from '@lib/nest-grammy/providers/bot.provider';
import {
  INestGrammyConfig,
  NEST_GRAMMY_CONFIG,
} from '@lib/nest-grammy/providers/config.provider';
import { UnauthorizedError } from '@lib/nest-grammy/types/errors';

@Injectable()
export class ListenerErrorService implements OnModuleInit {
  private readonly logger = new Logger(ListenerErrorService.name);

  constructor(
    @Inject(NEST_GRAMMY_CONFIG)
    private readonly config: INestGrammyConfig,
    @Inject(BOT_INSTANCE)
    private readonly bot: Bot,
  ) {}

  onModuleInit() {
    this.bot.catch((error: BotError) => {
      const isUnauthorized = error.error instanceof UnauthorizedError;
      if (isUnauthorized) {
        this.unauthorizedErrorHandler(error);
        return;
      }

      this.defaultErrorHandler(error);
    });
  }

  defaultErrorHandler(error: BotError) {
    this.logger.error(error.message, error.stack);
    this.config.errorHandler?.(error);
  }

  unauthorizedErrorHandler(error: BotError) {
    this.logger.warn(
      `Unauthorized access attempt, user: ${error.ctx.from?.username}, message: ${error.ctx.message?.text}`,
    );
    this.config.errorHandler?.(error);
  }
}
