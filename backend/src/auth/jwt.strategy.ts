import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(cs: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: cs.get('JWT_SECRET') || 'fallback-secret-key',
    });
  }

  async validate(payload: any) {
    // payload.sub contains user id
    return { id: payload.sub, email: payload.email, roles: payload.roles ?? [] };
  }
}
