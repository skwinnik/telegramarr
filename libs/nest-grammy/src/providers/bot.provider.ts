import { Bot } from 'grammy';

import { INestGrammyConfig } from '@lib/nest-grammy/providers/config.provider';

export const BOT_INSTANCE = Symbol('BOT_INSTANCE');
export class BotProvider {
  public static get(config: INestGrammyConfig) {
    return new Bot(config.token);
  }
}
