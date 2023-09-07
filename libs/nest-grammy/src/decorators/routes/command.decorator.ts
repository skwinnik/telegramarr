import { Reflector } from '@nestjs/core';

export const Command = Reflector.createDecorator<string>({
  key: 'COMMAND_DECORATOR',
});
