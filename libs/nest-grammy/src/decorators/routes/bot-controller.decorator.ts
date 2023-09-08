import { DiscoveryService } from '@nestjs/core';

import { BotControllerDecoratorOptions } from '@lib/nest-grammy/decorators/routes/types';

export const BotController =
  DiscoveryService.createDecorator<BotControllerDecoratorOptions>();
