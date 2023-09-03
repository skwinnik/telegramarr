import { CallbackQuery } from '@app/nest-grammy';
import { Command } from '@app/nest-grammy/decorators/command.decorator';
import {
  INestGrammyModuleConfig,
  MODULE_OPTIONS_TOKEN,
} from '@app/nest-grammy/nest-grammy.module-definition';
import {
  Injectable,
  Inject,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Bot, BotError, Context } from 'grammy';

import { LocatorService } from './locator.service';
import { On } from '../decorators/on.decorator';

@Injectable()
export class ListenerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ListenerService.name);

  private readonly bot: Bot;
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly config: INestGrammyModuleConfig,
    private readonly locatorService: LocatorService,
    private readonly reflector: Reflector,
  ) {
    this.bot = new Bot(config.token);
  }

  async onModuleInit() {
    this.registerControllers();
    this.logger.log(`Bot started: ${this.config.botName}`);
    this.bot.catch((error: BotError) => {
      this.logger.error(error.message, error.stack);
      this.config.errorHandler?.(error);
    });
    this.bot.start().catch((error: Error) => {
      this.logger.error(error.message, error.stack);
    });
  }

  async onModuleDestroy() {
    await this.bot.stop();

    this.logger.log(`Bot stopped: ${this.config.botName}`);
  }

  private registerControllers() {
    const controllers = this.locatorService.get(this.config.botName);
    for (const controller of controllers) {
      this.registerController(controller);
    }
  }

  private registerController(controller: unknown) {
    if (!controller) {
      throw new Error('Controller is undefined');
    }

    const prototype = Object.getPrototypeOf(controller);
    if (!prototype) {
      throw new Error('Controller prototype is undefined');
    }

    const propertyNames = Object.getOwnPropertyNames(prototype);

    for (const propertyName of propertyNames) {
      const property = prototype[propertyName];
      const isFunction = typeof property === 'function';
      const hasOnMetadata = !!this.reflector.get(On, property);
      const hasCallbackQueryMetadata = !!this.reflector.get(
        CallbackQuery,
        property,
      );
      const hasCommandMetadata = !!this.reflector.get(Command, property);

      if (!isFunction) continue;

      if (hasOnMetadata) {
        this.registerOn(controller, property);
      }

      if (hasCallbackQueryMetadata) {
        this.registerCallbackQuery(controller, property);
      }

      if (hasCommandMetadata) {
        this.registerCommand(controller, property);
      }
    }
  }

  private registerOn(controller: unknown, actionFn: () => unknown) {
    const filterQueries = this.reflector.get(On, actionFn);
    this.bot.on(filterQueries, actionFn.bind(controller));
  }

  private registerCallbackQuery(controller: unknown, actionFn: () => unknown) {
    const filterQuery = this.reflector.get(CallbackQuery, actionFn);
    this.bot.callbackQuery(filterQuery, actionFn.bind(controller));
  }

  private registerCommand(controller: unknown, actionFn: () => unknown) {
    const command = this.reflector.get(Command, actionFn);
    this.bot.command(command, actionFn.bind(controller));
  }
}
