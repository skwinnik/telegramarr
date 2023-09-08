import { Inject, Injectable, Logger } from '@nestjs/common';
import { Bot } from 'grammy';

import {
  INestGrammyModuleConfig,
  MODULE_OPTIONS_TOKEN,
} from '@lib/nest-grammy/nest-grammy.module-definition';
import { BOT_INSTANCE } from '@lib/nest-grammy/providers/bot.provider';
import { ExplorerService } from '@lib/nest-grammy/services/explorers/explorer.service';
import {
  IExploredCallbackQuery,
  IExploredCommand,
  IExploredOn,
} from '@lib/nest-grammy/services/explorers/types';

@Injectable()
export class RegisterService {
  private readonly logger = new Logger(RegisterService.name);
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly config: INestGrammyModuleConfig,
    @Inject(BOT_INSTANCE)
    private readonly bot: Bot,
    private readonly explorerService: ExplorerService,
  ) {}

  public async register() {
    const commands = this.explorerService.getCommands();
    const ons = this.explorerService.getOns();
    const callbackQueries = this.explorerService.getCallbackQueries();

    for await (const command of commands) {
      this.registerCommand(command);
    }

    for await (const on of ons) {
      this.registerOn(on);
    }

    for await (const callbackQuery of callbackQueries) {
      this.registerCallbackQuery(callbackQuery);
    }
  }

  private registerCommand(command: IExploredCommand) {
    this.bot.command(command.options, ...command.middlewares, command.fn);
    this.logger.log(`@${this.config.botName}: Command: /${command.options}`);
  }

  private registerOn(on: IExploredOn) {
    this.bot.on(on.options, ...on.middlewares, on.fn);
    this.logger.log(`@${this.config.botName}: On: "${on.options}"`);
  }

  private registerCallbackQuery(callbackQuery: IExploredCallbackQuery) {
    this.bot.callbackQuery(
      callbackQuery.options,
      ...callbackQuery.middlewares,
      callbackQuery.fn,
    );
    this.logger.log(
      `@${this.config.botName}: CallbackQuery: ${callbackQuery.options}`,
    );
  }
}
