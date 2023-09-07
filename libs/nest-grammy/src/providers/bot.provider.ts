import { INestGrammyModuleConfig } from '@app/nest-grammy/nest-grammy.module-definition';
import { Bot } from 'grammy';

export const BOT_INSTANCE = Symbol('BOT_INSTANCE');
export class BotProvider {
  public static get(config: INestGrammyModuleConfig) {
    return new Bot(config.token);
  }
}
