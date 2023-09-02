import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { ConfigurableModuleClass } from './nest-grammy.module-definition';
import { ListenerService } from './services/listener.service';
import { LocatorService } from './services/locator.service';

@Module({
  imports: [DiscoveryModule],
  providers: [LocatorService, ListenerService],
  exports: [],
})
export class NestGrammyModule extends ConfigurableModuleClass {}
