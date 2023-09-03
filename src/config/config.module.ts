import { Module } from '@nestjs/common';
import {
  ConfigModule as NestConfigModule,
  ConfigService,
} from '@nestjs/config';

import { APP_CONFIG, IConfig } from './types';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
    }),
  ],
  providers: [
    {
      provide: APP_CONFIG,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          telegram: {
            token: configService.get<string>('TELEGRAM_BOT_TOKEN'),
          },
          radarr: {
            baseUrl: configService.get<string>('RADARR_BASE_URL'),
            apiKey: configService.get<string>('RADARR_API_KEY'),
            rootFolderPath: configService.get<string>(
              'RADARR_ROOT_FOLDER_PATH',
            ),
            qualityProfileId: configService.get<number>(
              'RADARR_QUALITY_PROFILE_ID',
            ),
          },
        }) as IConfig,
    },
  ],
  exports: [APP_CONFIG],
})
export class ConfigModule {}
