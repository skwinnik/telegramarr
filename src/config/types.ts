export interface IConfig {
  telegram: {
    token: string;
  };
}

export const APP_CONFIG = Symbol('CONFIG');
