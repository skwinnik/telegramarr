import { ConfigurableModuleBuilder } from '@nestjs/common';

export interface IRadarrClientModuleConfig {
  baseUrl: string;
  apiKey: string;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<IRadarrClientModuleConfig>().build();
