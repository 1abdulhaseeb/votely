import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepo: Repository<Role>,
  ) {}

  findByName(name: string) {
    return this.rolesRepo.findOne({ where: { name } });
  }

  async findOrCreate(name: string) {
    let role = await this.findByName(name);
    if (!role) {
      role = this.rolesRepo.create({ name });
      return this.rolesRepo.save(role);
    }
    return role;
  }

  async list() {
    return this.rolesRepo.find();
  }
}
