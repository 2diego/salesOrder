import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersValidationsService } from './orders-validations.service';
import { OrdersValidationsController } from './orders-validations.controller';
import { OrderValidation } from '../../entities/order-validation.entity';
import { Order } from '../../entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderValidation, Order])],
  controllers: [OrdersValidationsController],
  providers: [OrdersValidationsService],
  exports: [OrdersValidationsService],
})
export class OrdersValidationsModule {}
