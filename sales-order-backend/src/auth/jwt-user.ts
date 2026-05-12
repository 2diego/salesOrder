import { UserRole } from '../entities/user.entity';

export type JwtUser = {
  userId: number;
  username: string;
  role: UserRole;
};
