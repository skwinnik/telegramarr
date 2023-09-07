import {
  BOT_INSTANCE,
  BotProvider,
} from '@app/nest-grammy/providers/bot.provider';
import { RegisterService } from '@app/nest-grammy/services/register.service';
import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import {
  ConfigurableModuleClass,
  INestGrammyModuleConfig,
  MODULE_OPTIONS_TOKEN,
} from './nest-grammy.module-definition';
import { ListenerService } from './services/listener.service';
import { LocatorService } from './services/locator.service';

@Module({
  imports: [DiscoveryModule],
  providers: [
    LocatorService,
    ListenerService,
    RegisterService,
    {
      inject: [MODULE_OPTIONS_TOKEN],
      provide: BOT_INSTANCE,
      useFactory: BotProvider.get,
    },
  ],
  exports: [],
})
export class NestGrammyModule extends ConfigurableModuleClass {}
