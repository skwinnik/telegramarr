import { Global, Module } from '@nestjs/common';

import { ConfigModule } from '@/config/config.module';
import { APP_CONFIG, IConfig } from '@/config/types';
import { NestGrammyModule } from '@lib/nest-grammy';

@Global()
@Module({
  imports: [
    ConfigModule,
    NestGrammyModule.registerAsync({
      imports: [ConfigModule],
      inject: [APP_CONFIG],
      useFactory: (config: IConfig) => {
        return {
          token: config.telegram.token,
        };
      },
    }),
  ],
  exports: [NestGrammyModule],
})
export class GrammyModule {}
