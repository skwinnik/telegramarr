import { Middleware } from 'grammy';

import {
  BotControllerDecoratorOptions,
  CallbackQueryDecoratorOptions,
  CommandDecoratorOptions,
  OnDecoratorOptions,
} from '@lib/nest-grammy/decorators/routes/types';

export interface IExploredController {
  instance: object;
  options: BotControllerDecoratorOptions;
}

export interface IExploredAction {
  controller: IExploredController;
  middlewares: Middleware[];
  fn: (...args: unknown[]) => unknown;
}

export interface IExploredCommand extends IExploredAction {
  options: CommandDecoratorOptions;
}

export interface IExploredOn extends IExploredAction {
  options: OnDecoratorOptions;
}

export interface IExploredCallbackQuery extends IExploredAction {
  options: CallbackQueryDecoratorOptions;
}
