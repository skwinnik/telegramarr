import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import {
  BOT_INSTANCE,
  BotProvider,
} from '@lib/nest-grammy/providers/bot.provider';
import { GuardsService } from '@lib/nest-grammy/services/guards.service';
import { ListenerErrorService } from '@lib/nest-grammy/services/listener-error.service';
import { RegisterService } from '@lib/nest-grammy/services/register.service';

import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
} from './nest-grammy.module-definition';
import { ListenerService } from './services/listener.service';
import { LocatorService } from './services/locator.service';

@Module({
  imports: [DiscoveryModule],
  providers: [
    LocatorService,
    ListenerService,
    ListenerErrorService,
    RegisterService,
    GuardsService,
    {
      inject: [MODULE_OPTIONS_TOKEN],
      provide: BOT_INSTANCE,
      useFactory: BotProvider.get,
    },
  ],
  exports: [],
})
export class NestGrammyModule extends ConfigurableModuleClass {}
