import { BotController, On } from '@app/nest-grammy';
import { Logger } from '@nestjs/common';
import { Context } from 'grammy';

@BotController({
  name: 'main',
})
export class MainController {
  private readonly logger = new Logger(MainController.name);

  @On('message')
  async onMessage(context: Context) {
    this.logger.log('Message received', context.message);
    await context.reply('Hello, world!');
  }
}
