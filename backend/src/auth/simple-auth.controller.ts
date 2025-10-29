import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import * as bcrypt from 'bcryptjs';

interface CreateUserDto {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

interface LoginDto {
  email: string;
  password: string;
}

@Controller('auth')
export class SimpleAuthController {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const { email, username, password, firstName, lastName, role = 'voter' } = createUserDto;
    
    // Validation
    if (!email || !username || !password) {
      throw new BadRequestException('Email, username, and password are required');
    }

    if (password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }

    if (!['voter', 'candidate', 'admin'].includes(role)) {
      throw new BadRequestException('Invalid role specified');
    }

    try {
      // Check if user already exists
      const existingUser = await this.databaseService.findUserByEmail(email);
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      const existingUsername = await this.databaseService.findUserByUsername(username);
      if (existingUsername) {
        throw new ConflictException('Username already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Create user
      const user = await this.databaseService.createUser(
        email, 
        hashedPassword, 
        username, 
        firstName, 
        lastName, 
        role as 'voter' | 'candidate' | 'admin'
      );
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      return {
        message: 'User registered successfully',
        user: userWithoutPassword
      };
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create user');
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    try {
      // Find user by email
      const user = await this.databaseService.findUserByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate JWT token
      const payload = { 
        sub: user.id, 
        email: user.email,
        username: user.username,
        role: user.role
      };
      
      const access_token = this.jwtService.sign(payload);
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      return {
        access_token,
        user: userWithoutPassword
      };
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      throw new UnauthorizedException('Login failed');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    try {
      const user = await this.databaseService.findUserById(req.user.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new UnauthorizedException('Failed to get profile');
    }
  }
}