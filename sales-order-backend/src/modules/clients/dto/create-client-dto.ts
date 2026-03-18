import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsEmail, IsOptional, ValidateIf } from 'class-validator';

export class CreateClientDTO {
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  // Si viene vacío (""), se omite para que @IsOptional lo ignore.
  @Transform(({ value }) => (typeof value === 'string' ? (value.trim() === '' ? undefined : value.trim()) : value))
  @ValidateIf((o) => o.email !== undefined)
  @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
  @IsOptional()
  email?: string;

  @IsString({ message: 'El teléfono debe ser texto' })
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  phone: string;

  @IsString({ message: 'La dirección debe ser texto' })
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  address: string;

  @IsString({ message: 'La ciudad debe ser texto' })
  @IsNotEmpty({ message: 'La ciudad es obligatoria' })
  city: string;

  @IsString({ message: 'El estado/provincia debe ser texto' })
  @IsNotEmpty({ message: 'El estado/provincia es obligatorio' })
  state: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsOptional()
  isActive?: boolean;
}
