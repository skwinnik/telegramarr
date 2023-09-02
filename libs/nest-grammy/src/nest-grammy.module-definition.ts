import { ConfigurableModuleBuilder } from '@nestjs/common';

export interface INestGrammyModuleConfig {
  /**
   * The name of the bot
   */
  botName: string;

  /**
   * The token of the bot
   */
  token: string;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<INestGrammyModuleConfig>().build();
