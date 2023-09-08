import { Module } from '@nestjs/common';

import { ConfigModule } from '@/config/config.module';
import { APP_CONFIG, IConfig } from '@/config/types';
import { MovieModule } from '@/movie/movie.module';
import { NestGrammyModule } from '@lib/nest-grammy';

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

    MovieModule,
  ],
})
export class AppModule {}
