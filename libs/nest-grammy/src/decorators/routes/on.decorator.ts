import { Reflector } from '@nestjs/core';

import type { OnDecoratorOptions } from '@lib/nest-grammy/decorators/routes/types';

export const On = Reflector.createDecorator<OnDecoratorOptions>({
  key: 'ON_DECORATOR',
});
