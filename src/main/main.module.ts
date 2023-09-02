import { Module } from '@nestjs/common';

import { MainController } from './main.controller';

@Module({
  providers: [MainController],
})
export class MainModule {}
