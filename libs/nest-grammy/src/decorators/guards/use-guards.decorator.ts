import { Reflector } from '@nestjs/core';
import { Context } from 'grammy';

export interface CanActivate {
  canActivate(context: Context): boolean | Promise<boolean>;
}

export type UseGuardsOptions = (
  | CanActivate
  | { new (...args: unknown[]): CanActivate }
)[];

export const UseGuards = Reflector.createDecorator<UseGuardsOptions>({
  key: 'USE_GUARDS_DECORATOR',
});
