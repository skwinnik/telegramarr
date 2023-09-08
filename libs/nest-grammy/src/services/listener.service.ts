import {
  Injectable,
  Inject,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { Bot } from 'grammy';

import {
  INestGrammyModuleConfig,
  MODULE_OPTIONS_TOKEN,
} from '@lib/nest-grammy/nest-grammy.module-definition';
import { BOT_INSTANCE } from '@lib/nest-grammy/providers/bot.provider';
import { RegisterService } from '@lib/nest-grammy/services/register.service';

@Injectable()
export class ListenerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ListenerService.name);

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly config: INestGrammyModuleConfig,
    @Inject(BOT_INSTANCE)
    private readonly bot: Bot,
    private readonly registerService: RegisterService,
  ) {}

  async onModuleInit() {
    await this.registerService.register();
    this.logger.log(`Bot started: ${this.config.botName}`);
    this.bot.start().catch((error: Error) => {
      this.logger.error(error.message, error.stack);
    });
  }

  async onModuleDestroy() {
    await this.bot.stop();

    this.logger.log(`Bot stopped: ${this.config.botName}`);
  }
}
