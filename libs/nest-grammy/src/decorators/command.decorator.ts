import { Reflector } from '@nestjs/core';
import { FilterQuery } from 'grammy';

export const Command = Reflector.createDecorator<string>({
  key: 'COMMAND_DECORATOR',
});
