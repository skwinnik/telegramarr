import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';
import { APP_CONFIG, IConfig } from '@/config/types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get<IConfig>(APP_CONFIG);
  if (config.logs) {
    app.useLogger(config.logs);
  }

  await app.listen(3000);
}
bootstrap();
