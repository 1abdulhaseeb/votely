import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    return this.usersService.validatePassword(email, password);
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, roles: user.roles?.map(r=>r.name) };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
