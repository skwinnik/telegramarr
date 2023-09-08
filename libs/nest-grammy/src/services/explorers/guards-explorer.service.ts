import { Injectable } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';

import { CanActivate, UseGuards } from '@lib/nest-grammy';
import { UseGuardsOptions } from '@lib/nest-grammy/decorators/guards/use-guards.decorator';

@Injectable()
export class GuardsExplorerService {
  constructor(
    private readonly reflector: Reflector,
    private readonly moduleRef: ModuleRef,
  ) {}

  public async getGuards(
    controller: unknown,
    action: (...args: unknown[]) => unknown,
  ): Promise<CanActivate[]> {
    const controllerPrototype = Object.getPrototypeOf(controller);
    if (!controllerPrototype) {
      throw new Error('Controller prototype is undefined');
    }

    const controllerGuards =
      this.reflector.get(UseGuards, controllerPrototype.constructor) || [];
    const actionGuards = this.reflector.get(UseGuards, action) || [];

    return [
      ...(await this.instantiateGuards(controllerGuards)),
      ...(await this.instantiateGuards(actionGuards)),
    ];
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
