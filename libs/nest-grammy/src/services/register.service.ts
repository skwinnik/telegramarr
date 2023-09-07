import {
  CallbackQuery,
  Command,
  On,
  UseGuards,
  CanActivate,
} from '@app/nest-grammy';
import { UseGuardsOptions } from '@app/nest-grammy/decorators/guards/use-guards.decorator';
import {
  INestGrammyModuleConfig,
  MODULE_OPTIONS_TOKEN,
} from '@app/nest-grammy/nest-grammy.module-definition';
import { BOT_INSTANCE } from '@app/nest-grammy/providers/bot.provider';
import { LocatorService } from '@app/nest-grammy/services/locator.service';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Controller } from '@nestjs/common/interfaces';
import { ModuleRef, Reflector } from '@nestjs/core';
import { Bot, Context, NextFunction } from 'grammy';

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
    private readonly moduleRef: ModuleRef,
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
    const checkAccess = await this.getCheckAccessFn(controller, actionFn);
    this.bot.on(filterQueries, checkAccess, actionFn.bind(controller));
  }

  private async registerCallbackQuery(
    controller: unknown,
    actionFn: (...args: unknown[]) => unknown,
  ) {
    const filterQuery = this.reflector.get(CallbackQuery, actionFn);
    const checkAccess = await this.getCheckAccessFn(controller, actionFn);
    this.bot.callbackQuery(filterQuery, checkAccess, actionFn.bind(controller));
  }

  private async registerCommand(
    controller: unknown,
    actionFn: (...args: unknown[]) => unknown,
  ) {
    const command = this.reflector.get(Command, actionFn);
    const checkAccess = await this.getCheckAccessFn(controller, actionFn);
    this.bot.command(command, checkAccess, actionFn.bind(controller));
  }

  private async getCheckAccessFn(
    controller: unknown,
    action: (...args: unknown[]) => unknown,
  ): Promise<(ctx: Context, next: NextFunction) => Promise<unknown>> {
    const controllerPrototype = Object.getPrototypeOf(controller);
    if (!controllerPrototype) {
      throw new Error('Controller prototype is undefined');
    }

    const controllerGuards =
      this.reflector.get(UseGuards, controllerPrototype.constructor) || [];
    const actionGuards = this.reflector.get(UseGuards, action) || [];

    const instantiatedGuards = [
      ...(await this.instantiateGuards(controllerGuards)),
      ...(await this.instantiateGuards(actionGuards)),
    ];

    return async (ctx: Context, next: NextFunction) => {
      const canActivate = await Promise.all(
        instantiatedGuards.map((guard) => guard.canActivate(ctx)),
      );

      if (canActivate.some((value) => !value)) {
        throw new Error('Unauthorized');
      }

      await next();
    };
  }

  private async instantiateGuards(guards: UseGuardsOptions) {
    const instances: CanActivate[] = [];
    for (const guard of guards) {
      if ('canActivate' in guard) {
        instances.push(guard);
        continue;
      }
      const instance = await this.moduleRef.create(guard);
      instances.push(instance);
    }

    return instances;
  }
}
