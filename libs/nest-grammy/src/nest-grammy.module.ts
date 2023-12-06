import { Module, OnModuleInit } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
} from '@lib/nest-grammy/nest-grammy.module-definition';
import {
  BOT_INSTANCE,
  BotProvider,
} from '@lib/nest-grammy/providers/bot.provider';
import {
  ConfigProvider,
  NEST_GRAMMY_CONFIG,
} from '@lib/nest-grammy/providers/config.provider';
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
      provide: NEST_GRAMMY_CONFIG,
      useFactory: ConfigProvider.get,
    },
    {
      inject: [NEST_GRAMMY_CONFIG],
      provide: BOT_INSTANCE,
      useFactory: BotProvider.get,
    },
  ],
  exports: [BOT_INSTANCE],
})
export class NestGrammyModule
  extends ConfigurableModuleClass
  implements OnModuleInit
{
  constructor(
    private readonly registerService: RegisterService,
    private readonly listenerService: ListenerService,
  ) {
    super();
  }

  async onModuleInit() {
    await this.registerService.register();
    await this.listenerService.start();
  }
}
