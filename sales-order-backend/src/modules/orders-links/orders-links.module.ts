import { Module } from '@nestjs/common';
import { OrdersLinksController } from './orders-links.controller';
import { OrdersLinksService } from './orders-links.service';

@Module({
  controllers: [OrdersLinksController],
  providers: [OrdersLinksService]
})
export class OrdersLinksModule {}
