import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersLinksController } from './orders-links.controller';
import { OrdersLinksService } from './orders-links.service';
import { OrderLink } from '../../entities/order-link.entity';
import { Order } from '../../entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderLink, Order])],
  controllers: [OrdersLinksController],
  providers: [OrdersLinksService],
  exports: [OrdersLinksService],
})
export class OrdersLinksModule {}
