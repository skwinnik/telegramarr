import { Bot } from 'grammy';

import { INestGrammyModuleConfig } from '@lib/nest-grammy/nest-grammy.module-definition';

export const BOT_INSTANCE = Symbol('BOT_INSTANCE');
export class BotProvider {
  public static get(config: INestGrammyModuleConfig) {
    return new Bot(config.token);
  }
}
