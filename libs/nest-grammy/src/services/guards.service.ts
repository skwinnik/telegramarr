import { CanActivate, UseGuards } from '@app/nest-grammy';
import { UseGuardsOptions } from '@app/nest-grammy/decorators/guards/use-guards.decorator';
import { Injectable } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { Context, NextFunction } from 'grammy';

@Injectable()
export class GuardsService {
  constructor(
    private readonly reflector: Reflector,
    private readonly moduleRef: ModuleRef,
  ) {}

  public async getCanActivateFn(
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
        throw new UnauthorizedException();
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

export class UnauthorizedException extends Error {
  name = UnauthorizedException.name;
}
