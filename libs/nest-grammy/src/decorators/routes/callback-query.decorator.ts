import { Reflector } from '@nestjs/core';

import { CallbackQueryDecoratorOptions } from '@lib/nest-grammy/decorators/routes/types';

export const CallbackQuery =
  Reflector.createDecorator<CallbackQueryDecoratorOptions>({
    key: 'CALLBACK_QUERY_DECORATOR',
  });
