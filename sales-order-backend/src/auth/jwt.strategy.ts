import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from '../entities/user.entity';
import { JwtUser } from './jwt-user';

type JwtPayload = {
  sub: number;
  username: string;
  role: UserRole;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') ?? 'dev-only-change-me',
    });
  }

  validate(payload: JwtPayload): JwtUser {
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
