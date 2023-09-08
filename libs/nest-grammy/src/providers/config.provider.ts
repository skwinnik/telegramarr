import { ErrorHandler } from 'grammy';

import { TInitNestGrammyModuleConfig } from '@lib/nest-grammy/nest-grammy.module-definition';
import { DEFAULT_ROUTE_NAME } from '@lib/nest-grammy/types';

export const NEST_GRAMMY_CONFIG = Symbol('NEST_GRAMMY_CONFIG');

export interface INestGrammyConfig {
  route: string;
  token: string;
  errorHandler?: ErrorHandler;
}

export class ConfigProvider {
  public static get(config: TInitNestGrammyModuleConfig): INestGrammyConfig {
    return {
      ...config,
      route: config.route ?? DEFAULT_ROUTE_NAME,
    };
  }
}
