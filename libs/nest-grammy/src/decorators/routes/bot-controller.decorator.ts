import { DiscoveryService } from '@nestjs/core';

export const BotController = DiscoveryService.createDecorator<{
  name: string;
}>();
