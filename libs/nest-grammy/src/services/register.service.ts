import { CallbackQuery, Command, On } from '@app/nest-grammy';
import {
  INestGrammyModuleConfig,
  MODULE_OPTIONS_TOKEN,
} from '@app/nest-grammy/nest-grammy.module-definition';
import { BOT_INSTANCE } from '@app/nest-grammy/providers/bot.provider';
import { GuardsService } from '@app/nest-grammy/services/guards.service';
import { LocatorService } from '@app/nest-grammy/services/locator.service';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Bot } from 'grammy';

@Injectable()
export class RegisterService {
  private readonly logger = new Logger(RegisterService.name);

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly config: INestGrammyModuleConfig,
    @Inject(BOT_INSTANCE)
    private readonly bot: Bot,
    private readonly locatorService: LocatorService,
    private readonly reflector: Reflector,
    private readonly guardsService: GuardsService,
  ) {}

  public async register() {
    const controllers = this.locatorService.get(this.config.botName);
    for (const controller of controllers) {
      await this.registerController(controller);
    }
  }

  private async registerController(controller: unknown) {
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
        await this.registerOn(controller, property);
      }

      if (hasCallbackQueryMetadata) {
        await this.registerCallbackQuery(controller, property);
      }

      if (hasCommandMetadata) {
        await this.registerCommand(controller, property);
      }
    }
  }

  private async registerOn(
    controller: unknown,
    actionFn: (...args: unknown[]) => unknown,
  ) {
    const filterQueries = this.reflector.get(On, actionFn);
    const canActivate = await this.guardsService.getCanActivateFn(
      controller,
      actionFn,
    );

    this.bot.on(filterQueries, canActivate, actionFn.bind(controller));
  }

  private async registerCallbackQuery(
    controller: unknown,
    actionFn: (...args: unknown[]) => unknown,
  ) {
    const filterQuery = this.reflector.get(CallbackQuery, actionFn);
    const canActivate = await this.guardsService.getCanActivateFn(
      controller,
      actionFn,
    );

    this.bot.callbackQuery(filterQuery, canActivate, actionFn.bind(controller));
  }

  private async registerCommand(
    controller: unknown,
    actionFn: (...args: unknown[]) => unknown,
  ) {
    const command = this.reflector.get(Command, actionFn);
    const canActivate = await this.guardsService.getCanActivateFn(
      controller,
      actionFn,
    );

    this.bot.command(command, canActivate, actionFn.bind(controller));
  }
}
