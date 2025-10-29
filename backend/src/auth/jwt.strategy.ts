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
    // Only return essential data from JWT payload
    // Always fetch role from database to ensure consistency
    return { 
      sub: payload.sub,
      email: payload.email, 
      username: payload.username
    };
  }
}
