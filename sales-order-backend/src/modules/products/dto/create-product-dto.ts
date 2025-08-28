import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, IsPositive } from 'class-validator';

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @IsPositive()
  categoryId: number;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsOptional()
  isActive?: boolean;
}
