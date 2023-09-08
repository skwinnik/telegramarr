import { Module } from '@nestjs/common';

import { ConfigModule } from '@/config/config.module';
import { APP_CONFIG, IConfig } from '@/config/types';
import { RadarrClientModule } from '@lib/radarr-client';

import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';

@Module({
  imports: [
    ConfigModule,
    RadarrClientModule.registerAsync({
      imports: [ConfigModule],
      inject: [APP_CONFIG],
      useFactory: (config: IConfig) => {
        return {
          baseUrl: config.radarr.baseUrl,
          apiKey: config.radarr.apiKey,
        };
      },
    }),
  ],
  providers: [MovieController, MovieService],
})
export class MovieModule {}
