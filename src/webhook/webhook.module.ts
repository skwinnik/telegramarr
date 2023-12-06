import { Module } from '@nestjs/common';

import { WebhookController } from '@/webhook/webhook.controller';

@Module({
  controllers: [WebhookController],
})
export class WebhookModule {}
