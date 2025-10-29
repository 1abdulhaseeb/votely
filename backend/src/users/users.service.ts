import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { username } });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepo.find();
  }

  async createUser(
    email: string, 
    password: string, 
    username?: string, 
    firstName?: string, 
    lastName?: string, 
    role: UserRole = UserRole.VOTER
  ): Promise<User> {
    // Check if user already exists
    const existingEmail = await this.findByEmail(email);
    if (existingEmail) {
      throw new ConflictException('Email already registered');
    }

    const finalUsername = username || email.split('@')[0];
    const existingUsername = await this.findByUsername(finalUsername);
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    // Hash password
    const hash = await bcrypt.hash(password, 12);

    // Create user
    const user = this.usersRepo.create({
      email,
      username: finalUsername,
      firstName,
      first_name: firstName,
      lastName,
      last_name: lastName,
      password: hash,
      role,
    });

    return this.usersRepo.save(user);
  }

  async updateUserRole(userId: number, role: UserRole): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.role = role;
    return this.usersRepo.save(user);
  }

  async promoteToCandidate(userId: number): Promise<User> {
    return this.updateUserRole(userId, UserRole.CANDIDATE);
  }

  async promoteToAdmin(userId: number): Promise<User> {
    return this.updateUserRole(userId, UserRole.ADMIN);
  }

  async demoteToVoter(userId: number): Promise<User> {
    return this.updateUserRole(userId, UserRole.VOTER);
  }

  async validatePassword(email: string, plain: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;
    
    const ok = await bcrypt.compare(plain, user.password);
    if (!ok) return null;
    
    return user;
  }

  async deleteUser(userId: number): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepo.remove(user);
  }

  async getCandidates(): Promise<User[]> {
    return this.usersRepo.find({ 
      where: { role: UserRole.CANDIDATE }
    });
  }

  async getVoters(): Promise<User[]> {
    return this.usersRepo.find({ 
      where: { role: UserRole.VOTER }
    });
  }

  async getAdmins(): Promise<User[]> {
    return this.usersRepo.find({ 
      where: { role: UserRole.ADMIN }
    });
  }
}
