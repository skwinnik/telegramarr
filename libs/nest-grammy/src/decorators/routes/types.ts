import { FilterQuery } from 'grammy';

export type BotDecoratorOptions = string | undefined;
export type CallbackQueryDecoratorOptions = string | RegExp;
export type CommandDecoratorOptions = string;
export type OnDecoratorOptions = FilterQuery | FilterQuery[];
