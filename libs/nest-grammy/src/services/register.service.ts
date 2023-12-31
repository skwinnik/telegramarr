import { Inject, Injectable, Logger } from '@nestjs/common';
import { Bot } from 'grammy';

import { BOT_INSTANCE } from '@lib/nest-grammy/providers/bot.provider';
import {
  INestGrammyConfig,
  NEST_GRAMMY_CONFIG,
} from '@lib/nest-grammy/providers/config.provider';
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
    @Inject(NEST_GRAMMY_CONFIG)
    private readonly config: INestGrammyConfig,
    @Inject(BOT_INSTANCE)
    private readonly bot: Bot,
    private readonly explorerService: ExplorerService,
  ) {}

  public async register() {
    const commands = this.explorerService.getCommands();
    const ons = this.explorerService.getOns();
    const callbackQueries = this.explorerService.getCallbackQueries();

    this.registerVerboseMiddleware();

    for await (const command of commands) {
      this.registerCommand(command);
    }

    for await (const on of ons) {
      this.registerOn(on);
    }

    for await (const callbackQuery of callbackQueries) {
      this.registerCallbackQuery(callbackQuery);
    }

    this.registerCatchAllMiddleware();
  }

  private registerCommand(command: IExploredCommand) {
    this.bot.command(
      command.options,
      ...command.middlewares,
      command.fn.bind(command.controller.instance),
    );
    this.logger.log(`@${this.config.route}: Command: /${command.options}`);
  }

  private registerOn(on: IExploredOn) {
    this.bot.on(
      on.options,
      ...on.middlewares,
      on.fn.bind(on.controller.instance),
    );
    this.logger.log(`@${this.config.route}: On: "${on.options}"`);
  }

  private registerCallbackQuery(callbackQuery: IExploredCallbackQuery) {
    this.bot.callbackQuery(
      callbackQuery.options,
      ...callbackQuery.middlewares,
      callbackQuery.fn.bind(callbackQuery.controller.instance),
    );
    this.logger.log(
      `@${this.config.route}: CallbackQuery: ${callbackQuery.options}`,
    );
  }

  private registerVerboseMiddleware() {
    this.bot.use(async (ctx, next) => {
      const { message, callbackQuery } = ctx;
      if (!message && !callbackQuery) return next();

      if (message)
        this.logger.verbose(
          `@${this.config.route}: ${message.from.username} sent: ${message.text}`,
        );

      if (callbackQuery)
        this.logger.verbose(
          `@${this.config.route}: ${callbackQuery.from.username} sent callbackQuery: ${callbackQuery.data}`,
        );

      return next();
    });
    this.logger.verbose(`@${this.config.route}: Verbose middleware registered`);
  }

  private registerCatchAllMiddleware() {
    this.bot.use(async (ctx, next) => {
      const { message, callbackQuery } = ctx;

      if (!message && !callbackQuery) return next();

      if (message)
        this.logger.warn(
          `@${this.config.route}: No handler for message sent by ${message.from.username}: ${message.text}`,
        );

      if (callbackQuery)
        this.logger.warn(
          `@${this.config.route}: No handler for message sent by ${callbackQuery.from.username}: ${callbackQuery.message}`,
        );

      await next();
    });
    this.logger.log(`@${this.config.route}: CatchAll middleware registered`);
  }
}
