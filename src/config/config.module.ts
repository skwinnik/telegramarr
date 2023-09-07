import { Global, Module } from '@nestjs/common';
import {
  ConfigModule as NestConfigModule,
  ConfigService,
} from '@nestjs/config';

import { APP_CONFIG } from './types';

import { ConfigFactory } from '@/config/config.provider';
import YamlLoader from '@/config/yaml.loader';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [YamlLoader],
      envFilePath: ['.env.local', '.env'],
    }),
  ],
  providers: [
    {
      provide: APP_CONFIG,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ConfigFactory.get(configService),
    },
  ],
  exports: [APP_CONFIG],
})
export class ConfigModule {}
