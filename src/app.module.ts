import { Module } from '@nestjs/common';
import { ItemsController } from './items/items.controller';
import { TelegramService } from './telegram/telegram.service';
import { UserService } from './services/services.service';
@Module({
  imports: [],
  controllers: [ItemsController],
  providers: [TelegramService,UserService],
})
export class AppModule {
  constructor() {
    console.log('AppModule');
  }
}
