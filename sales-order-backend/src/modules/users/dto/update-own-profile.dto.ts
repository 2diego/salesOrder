import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * Solo campos que el usuario puede cambiar sobre sí mismo.
 * Nunca rol, contraseña ni isActive desde este DTO.
 */
export class UpdateOwnProfileDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser texto' })
  @MinLength(1, { message: 'El nombre no puede estar vacío' })
  @MaxLength(200, { message: 'El nombre es demasiado largo' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
  @MaxLength(320, { message: 'El correo es demasiado largo' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser texto' })
  @MaxLength(40, { message: 'El teléfono es demasiado largo' })
  phone?: string;
}
