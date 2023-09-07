import {
  BOT_INSTANCE,
  BotProvider,
} from '@app/nest-grammy/providers/bot.provider';
import { GuardsService } from '@app/nest-grammy/services/guards.service';
import { ListenerErrorService } from '@app/nest-grammy/services/listener-error.service';
import { RegisterService } from '@app/nest-grammy/services/register.service';
import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

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
