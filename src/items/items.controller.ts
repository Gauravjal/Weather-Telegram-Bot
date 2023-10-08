import { Controller, Get } from '@nestjs/common';

@Controller('items')
export class ItemsController {
  private readonly items: string[] = ['welcome', 'to', 'hell'];

  @Get()
  findAll(): string[] {
    return this.items;
  }
}
