import { IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';
import { OrderStatus } from '../../../entities/order.entity';

export class CreateOrderDto {
  @IsNumber()
  clientId: number;

  @IsNumber()
  createdById: number;

  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus = OrderStatus.PENDING;

  @IsString()
  @IsOptional()
  notes?: string;
}