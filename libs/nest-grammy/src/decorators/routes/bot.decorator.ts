import { DiscoveryService } from '@nestjs/core';

import { BotDecoratorOptions } from '@lib/nest-grammy/decorators/routes/types';
import { DEFAULT_ROUTE_NAME } from '@lib/nest-grammy/types';

export const BotInner = DiscoveryService.createDecorator<BotDecoratorOptions>();

export const Bot = (route: BotDecoratorOptions = DEFAULT_ROUTE_NAME) => {
  return BotInner(route);
};

Bot.KEY = BotInner.KEY;
