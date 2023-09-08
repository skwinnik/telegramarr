import { Inject, Injectable } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { Middleware } from 'grammy';

import { Bot, CallbackQuery, Command, On } from '@lib/nest-grammy';
import {
  INestGrammyConfig,
  NEST_GRAMMY_CONFIG,
} from '@lib/nest-grammy/providers/config.provider';
import { GuardsExplorerService } from '@lib/nest-grammy/services/explorers/guards-explorer.service';
import {
  IExploredAction,
  IExploredCallbackQuery,
  IExploredCommand,
  IExploredController,
  IExploredOn,
} from '@lib/nest-grammy/services/explorers/types';
import { UnauthorizedError } from '@lib/nest-grammy/types/errors';

@Injectable()
export class ExplorerService {
  constructor(
    @Inject(NEST_GRAMMY_CONFIG)
    private readonly config: INestGrammyConfig,
    private readonly guardsService: GuardsExplorerService,
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  public async *getCommands(): AsyncGenerator<IExploredCommand> {
    const exploredActions = this.getActions();
    for await (const exploredAction of exploredActions) {
      const { controller, fn, middlewares } = exploredAction;
      const metadata = this.reflector.get(Command, fn);

      if (!metadata) continue;

      yield {
        controller,
        middlewares,
        fn,
        options: metadata,
      };
    }
  }

  public async *getOns(): AsyncGenerator<IExploredOn> {
    const exploredActions = this.getActions();
    for await (const exploredAction of exploredActions) {
      const { controller, fn, middlewares } = exploredAction;

      const metadata = this.reflector.get(On, fn);

      if (!metadata) continue;

      yield {
        controller,
        middlewares,
        fn,
        options: metadata,
      };
    }
  }

  public async *getCallbackQueries(): AsyncGenerator<IExploredCallbackQuery> {
    const exploredActions = this.getActions();
    for await (const exploredAction of exploredActions) {
      const { controller, fn, middlewares } = exploredAction;
      const metadata = this.reflector.get(CallbackQuery, fn);

      if (!metadata) continue;

      yield {
        controller,
        middlewares,
        fn,
        options: metadata,
      };
    }
  }

  private async *getActions(): AsyncGenerator<IExploredAction> {
    const exploredControllers = this.getControllers();
    for (const exploredController of exploredControllers) {
      const prototype = Object.getPrototypeOf(exploredController.instance);
      if (!prototype) {
        throw new Error('Controller prototype is undefined');
      }

      const propertyNames = Object.getOwnPropertyNames(prototype);

      for (const propertyName of propertyNames) {
        const property = prototype[propertyName];
        const isFunction = typeof property === 'function';

        if (!isFunction) continue;

        yield {
          controller: exploredController,
          middlewares: [
            await this.getGuardMiddleware(
              exploredController.instance,
              property,
            ),
          ],
          fn: property,
        };
      }
    }
  }

  private *getControllers(): Generator<IExploredController> {
    const route = this.config.route;
    const instanceWrappers = this.discoveryService.getProviders({
      metadataKey: Bot.KEY,
    });

    for (const wrapper of instanceWrappers) {
      const metadata = this.discoveryService.getMetadataByDecorator(
        Bot,
        wrapper,
      );

      if (metadata !== route || !wrapper.instance) {
        continue;
      }

      const controller = wrapper.instance;
      yield {
        instance: controller,
        options: metadata,
      };
    }
  }

  private async getGuardMiddleware(
    controller: unknown,
    action: (...args: unknown[]) => unknown,
  ): Promise<Middleware> {
    const canActivateFns = await this.guardsService.getGuards(
      controller,
      action,
    );

    return async (ctx, next) => {
      for (const canActivateFn of canActivateFns) {
        const canActivate = await canActivateFn.canActivate(ctx);
        if (!canActivate) {
          throw new UnauthorizedError();
        }
      }
      await next();
    };
  }
}
