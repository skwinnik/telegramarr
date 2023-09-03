import { Reflector } from '@nestjs/core';
import { FilterQuery } from 'grammy';

export const CallbackQuery = Reflector.createDecorator<string | RegExp>({
  key: 'CALLBACK_QUERY_DECORATOR',
});
