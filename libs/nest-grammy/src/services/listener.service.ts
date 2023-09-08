import { Injectable, Inject, Logger } from '@nestjs/common';
import { Bot } from 'grammy';

import { BOT_INSTANCE } from '@lib/nest-grammy/providers/bot.provider';
import {
  INestGrammyConfig,
  NEST_GRAMMY_CONFIG,
} from '@lib/nest-grammy/providers/config.provider';

@Injectable()
export class ListenerService {
  private readonly logger = new Logger(ListenerService.name);

  constructor(
    @Inject(NEST_GRAMMY_CONFIG)
    private readonly config: INestGrammyConfig,
    @Inject(BOT_INSTANCE)
    private readonly bot: Bot,
  ) {}

  public async start() {
    this.logger.log(`Bot started: ${this.config.route}`);
    this.bot.start().catch((error: Error) => {
      this.logger.error(error.message, error.stack);
    });
  }

  public async stop() {
    await this.bot.stop();

    this.logger.log(`Bot stopped: ${this.config.route}`);
  }
}
