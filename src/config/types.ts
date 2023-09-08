import { LogLevel } from '@nestjs/common';

export interface IConfig {
  logs: LogLevel[];
  access: {
    allowedUserNames: string[];
  };
  telegram: {
    token: string;
  };

  radarr: {
    baseUrl: string;
    apiKey: string;
    rootFolderPath: string;
    qualityProfileId: number;
  };
}

export const APP_CONFIG = Symbol('CONFIG');
