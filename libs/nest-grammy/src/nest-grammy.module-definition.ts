import { ConfigurableModuleBuilder } from '@nestjs/common';
import { ErrorHandler } from 'grammy';

export interface INestGrammyModuleConfig {
  /**
   * The name of the bot
   */
  botName: string;

  /**
   * The token of the bot
   */
  token: string;

  /**
   * Error handler
   */
  errorHandler?: ErrorHandler;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<INestGrammyModuleConfig>().build();
