import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
} from '@lib/nest-grammy/nest-grammy.module-definition';
import {
  BOT_INSTANCE,
  BotProvider,
} from '@lib/nest-grammy/providers/bot.provider';
import { ExplorerService } from '@lib/nest-grammy/services/explorers/explorer.service';
import { GuardsExplorerService } from '@lib/nest-grammy/services/explorers/guards-explorer.service';
import { ListenerErrorService } from '@lib/nest-grammy/services/listener-error.service';
import { ListenerService } from '@lib/nest-grammy/services/listener.service';
import { RegisterService } from '@lib/nest-grammy/services/register.service';

@Module({
  imports: [DiscoveryModule],
  providers: [
    ExplorerService,
    RegisterService,
    ListenerService,
    ListenerErrorService,
    GuardsExplorerService,
    {
      inject: [MODULE_OPTIONS_TOKEN],
      provide: BOT_INSTANCE,
      useFactory: BotProvider.get,
    },
  ],
  exports: [],
})
export class NestGrammyModule extends ConfigurableModuleClass {}
