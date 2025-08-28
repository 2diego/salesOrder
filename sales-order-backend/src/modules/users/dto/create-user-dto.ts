import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional, IsIn } from 'class-validator';
import { UserRole } from 'src/entities/user.entity';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsIn([UserRole.ADMIN, UserRole.SELLER])
  role?: UserRole;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsOptional()
  isActive?: boolean;
}