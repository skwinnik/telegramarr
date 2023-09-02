import { NestGrammyModule } from '@app/nest-grammy';
import { Module } from '@nestjs/common';

import { ConfigModule } from './config/config.module';
import { MainModule } from './main/main.module';

import { APP_CONFIG, IConfig } from '@/config/types';

@Module({
  imports: [
    ConfigModule,
    NestGrammyModule.registerAsync({
      imports: [ConfigModule],
      inject: [APP_CONFIG],
      useFactory: (config: IConfig) => {
        return {
          botName: 'main',
          token: config.telegram.token,
        };
      },
    }),
    MainModule,
  ],
})
export class AppModule {}
