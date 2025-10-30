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
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserRole } from '../users/user.entity';
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
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
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
      // Create user using UsersService (it handles validation internally)
      const user = await this.usersService.createUser(
        email, 
        password, // UsersService will hash the password
        username, 
        firstName, 
        lastName, 
        role as UserRole
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
      // Use UsersService validatePassword method
      const user = await this.usersService.validatePassword(email, password);
      if (!user) {
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
      console.log('JWT payload from req.user:', req.user);
      
      const userId = req.user.sub;
      console.log('Looking up user ID:', userId);
      
      const user = await this.usersService.findById(userId);
      console.log('Raw user from database:', JSON.stringify(user, null, 2));
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      
      // If user doesn't have a role, assign default voter role
      if (!user.role) {
        console.log('User has no role, assigning voter role');
        const updatedUser = await this.usersService.updateUserRole(user.id, UserRole.VOTER);
        const { password, ...userWithoutPassword } = updatedUser;
        console.log('Updated user with voter role:', JSON.stringify(userWithoutPassword, null, 2));
        return userWithoutPassword;
      }
      
      // Create clean response object
      const response = {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
      
      console.log('Final response being returned:', JSON.stringify(response, null, 2));
      return response;
    } catch (error) {
      console.error('Profile error:', error);
      throw new UnauthorizedException('Failed to get profile');
    }
  }
}