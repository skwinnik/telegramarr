import { Reflector } from '@nestjs/core';

import { CommandDecoratorOptions } from '@lib/nest-grammy/decorators/routes/types';

export const Command = Reflector.createDecorator<CommandDecoratorOptions>({
  key: 'COMMAND_DECORATOR',
});
