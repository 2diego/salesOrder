import { Module } from '@nestjs/common';
import { OrdersValidationsService } from './orders-validations.service';
import { OrdersValidationsController } from './orders-validations.controller';

@Module({
  providers: [OrdersValidationsService],
  controllers: [OrdersValidationsController]
})
export class OrdersValidationsModule {}
