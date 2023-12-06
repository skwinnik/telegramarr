import { Module } from '@nestjs/common';

import { ConfigModule } from '@/config/config.module';
import { GrammyModule } from '@/grammy.module';
import { MovieModule } from '@/movie/movie.module';
import { WebhookModule } from '@/webhook/webhook.module';

@Module({
  imports: [ConfigModule, GrammyModule, MovieModule, WebhookModule],
})
export class AppModule {}
