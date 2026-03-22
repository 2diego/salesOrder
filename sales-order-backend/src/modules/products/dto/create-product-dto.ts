import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, IsPositive, MaxLength, IsUrl, ValidateIf } from 'class-validator';

export class CreateProductDTO {
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsString({ message: 'La descripción debe ser texto' })
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  price: number;

  @IsNumber({}, { message: 'La categoría debe ser un número' })
  @IsPositive({ message: 'La categoría es obligatoria' })
  categoryId: number;

  @IsString({ message: 'El SKU debe ser texto' })
  @IsOptional()
  sku?: string;

  /** Enlace directo a imagen (https://...), no página de galería. */
  @IsOptional()
  @ValidateIf((_, v) => v != null && String(v).trim() !== '')
  @IsUrl({ require_protocol: true }, { message: 'La URL de imagen debe ser válida (https://...)' })
  @MaxLength(2048)
  imageUrl?: string | null;

  @IsNumber({}, { message: 'El stock debe ser un número' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock: number;

  @IsOptional()
  isActive?: boolean;
}
