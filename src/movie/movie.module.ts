import { RadarrClientModule } from '@app/radarr-client';
import { Module } from '@nestjs/common';

import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';

import { ConfigModule } from '@/config/config.module';
import { APP_CONFIG, IConfig } from '@/config/types';

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
