import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersItemsController } from './orders-items.controller';
import { OrdersItemsService } from './orders-items.service';
import { OrderItem } from '../../entities/order-item.entity';
import { Order } from '../../entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem, Order])],
  controllers: [OrdersItemsController],
  providers: [OrdersItemsService],
  exports: [OrdersItemsService],
})
export class OrdersItemsModule {}
