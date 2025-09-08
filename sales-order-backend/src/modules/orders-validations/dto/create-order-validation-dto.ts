import { IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';
import { OrderStatus } from '../../../entities/order.entity';

export class CreateOrderValidationDto {
  @IsNumber()
  orderId: number;

  @IsNumber()
  validatedById: number;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}