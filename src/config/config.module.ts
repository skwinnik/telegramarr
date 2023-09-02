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
        }) as IConfig,
    },
  ],
  exports: [APP_CONFIG],
})
export class ConfigModule {}
