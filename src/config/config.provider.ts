import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IConfig } from '@/config/types';

export class ConfigFactory {
  private static Logger = new Logger(ConfigFactory.name);

  public static get(configService: ConfigService): IConfig {
    const config = {
      logs:
        configService.get<string>('LOGS')?.split(',') ||
        configService.get<string[]>('logs'),
      access: {
        allowedUserNames:
          configService.get<string>('ACCESS_ALLOWED_USER_NAMES')?.split(',') ||
          configService.get<string[]>('access.allowedUserNames'),
      },
      telegram: {
        token:
          configService.get<string>('TELEGRAM_BOT_TOKEN') ||
          configService.get<string>('telegram.botToken'),
      },
      radarr: {
        baseUrl:
          configService.get<string>('RADARR_BASE_URL') ||
          configService.get<string>('radarr.baseUrl'),
        apiKey:
          configService.get<string>('RADARR_API_KEY') ||
          configService.get<string>('radarr.apiKey'),
        rootFolderPath:
          configService.get<string>('RADARR_ROOT_FOLDER_PATH') ||
          configService.get<string>('radarr.rootFolderPath'),
        qualityProfileId:
          configService.get<number>('RADARR_QUALITY_PROFILE_ID') ||
          configService.get<number>('radarr.qualityProfileId'),
      },
    } as IConfig;

    ConfigFactory.Logger.log(JSON.stringify(config, null, 2));

    return config;
  }
}
