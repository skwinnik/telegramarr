import { CanActivate } from '@app/nest-grammy';
import { Inject } from '@nestjs/common';
import { Context } from 'grammy';

import { APP_CONFIG, IConfig } from '@/config/types';

export class UserGuard implements CanActivate {
  constructor(@Inject(APP_CONFIG) private readonly config: IConfig) {}

  canActivate(context: Context): boolean | Promise<boolean> {
    return (
      (context.from?.username &&
        this.config.access.allowedUserNames &&
        this.config.access.allowedUserNames.includes(context.from?.username)) ||
      false
    );
  }
}
