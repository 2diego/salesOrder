import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryDTO {
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsString({ message: 'La descripción debe ser texto' })
  @IsOptional()
  description?: string;
}
