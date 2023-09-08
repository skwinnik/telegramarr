import { FilterQuery } from 'grammy';

export type BotControllerDecoratorOptions = { name: string };
export type CallbackQueryDecoratorOptions = string | RegExp;
export type CommandDecoratorOptions = string;
export type OnDecoratorOptions = FilterQuery | FilterQuery[];
