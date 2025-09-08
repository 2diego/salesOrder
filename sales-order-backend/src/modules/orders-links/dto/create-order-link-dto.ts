import { IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateOrderLinkDto {
  @IsNumber()
  orderId: number;

  @IsNumber()
  createdById: number;

  @IsDateString()
  @IsOptional()
  expiresAt?: Date;
}