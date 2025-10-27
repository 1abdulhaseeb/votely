import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private rolesService: RolesService,
  ) {}

  async findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  async createUser(email: string, password: string, username?: string) {
    const existing = await this.findByEmail(email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hash = await bcrypt.hash(password, 10);

    const user = this.usersRepo.create({
      email,
      username: username || email.split('@')[0], // Use email prefix as default username
      password: hash,
    });

    return this.usersRepo.save(user);
  }

  async validatePassword(email: string, plain: string) {
    const user = await this.findByEmail(email);
    if (!user) return null;
    const ok = await bcrypt.compare(plain, user.password);
    if (!ok) return null;
    return user;
  }
}
