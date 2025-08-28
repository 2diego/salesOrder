import { UserRole } from 'src/entities/user.entity';

export class UpdateUserDTO {
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  name?: string;
  phone?: string;
  isActive?: boolean;
}
