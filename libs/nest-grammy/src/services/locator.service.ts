import { Injectable } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

import { BotController } from '../decorators/routes/bot-controller.decorator';

@Injectable()
export class LocatorService {
  constructor(private readonly discoveryService: DiscoveryService) {}

  get(botName: string): unknown[] {
    const instanceWrappers = this.discoveryService.getProviders({
      metadataKey: BotController.KEY,
    });

    return instanceWrappers
      .filter((wrapper) => {
        const metadata = this.discoveryService.getMetadataByDecorator(
          BotController,
          wrapper,
        );

        if (metadata?.name === botName && wrapper.instance) {
          return wrapper;
        }
      })
      .map((wrapper) => wrapper.instance);
  }
}
