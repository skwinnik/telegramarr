export interface IConfig {
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
