import { Reflector } from '@nestjs/core';
import { FilterQuery } from 'grammy';

export const On = Reflector.createDecorator<FilterQuery | FilterQuery[]>({
  key: 'ON_DECORATOR',
});
