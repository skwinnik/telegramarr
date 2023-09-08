import { ConfigurableModuleBuilder } from '@nestjs/common';

import { INestGrammyConfig } from '@lib/nest-grammy/providers/config.provider';

export type TInitNestGrammyModuleConfig = Omit<INestGrammyConfig, 'route'> & {
  route?: string;
};

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<TInitNestGrammyModuleConfig>().build();
