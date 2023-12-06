import { Controller, Inject, Param, Post } from '@nestjs/common';
import { Bot } from 'grammy';

import { BOT_INSTANCE } from '@lib/nest-grammy';

@Controller('webhook')
export class WebhookController {
  constructor(@Inject(BOT_INSTANCE) private readonly bot: Bot) {}

  @Post('text/:chatId/:text')
  async text(@Param('chatId') chatId: string, @Param('text') text: string) {
    await this.bot.api.sendMessage(chatId, text);
  }
}
