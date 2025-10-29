import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  Request,
  ParseIntPipe,
  ForbiddenException,
  BadRequestException
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from './user.entity';

interface UpdateUserRoleDto {
  role: UserRole;
}

interface CreateUserDto {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: 'voter' | 'candidate' | 'admin';
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(@Request() req) {
    // Only admins can see all users
    const currentUser = await this.usersService.findById(req.user.sub);
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Access denied');
    }

    const users = await this.usersService.findAll();
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('candidates')
  async getCandidates() {
    const candidates = await this.usersService.getCandidates();
    return candidates.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }



  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const currentUser = await this.usersService.findById(req.user.sub);
    
    // Users can only see their own profile unless they're admin
    if (currentUser?.role !== UserRole.ADMIN && currentUser?.id !== id) {
      throw new ForbiddenException('You can only view your own profile');
    }

    const user = await this.usersService.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createUser(@Body() dto: CreateUserDto, @Request() req) {
    // Only admins can create users
    const currentUser = await this.usersService.findById(req.user.sub);
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can create users');
    }

    const user = await this.usersService.createUser(
      dto.email,
      dto.password,
      dto.username,
      dto.firstName,
      dto.lastName,
      (dto.role as UserRole) || UserRole.VOTER
    );

    const { password, ...userWithoutPassword } = user;
    return {
      message: 'User created successfully',
      user: userWithoutPassword
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/role')
  async updateUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserRoleDto,
    @Request() req
  ) {
    // Only admins can update user roles
    const currentUser = await this.usersService.findById(req.user.sub);
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can update user roles');
    }

    if (!['voter', 'candidate', 'admin'].includes(dto.role)) {
      throw new BadRequestException('Invalid role specified');
    }

    const user = await this.usersService.updateUserRole(id, dto.role);
    const { password, ...userWithoutPassword } = user;
    
    return {
      message: `User role updated to ${dto.role}`,
      user: userWithoutPassword
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/promote-candidate')
  async promoteToCandidate(@Param('id', ParseIntPipe) id: number, @Request() req) {
    // Only admins can promote users
    const currentUser = await this.usersService.findById(req.user.sub);
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can promote users');
    }

    const user = await this.usersService.promoteToCandidate(id);
    const { password, ...userWithoutPassword } = user;
    
    return {
      message: 'User promoted to candidate',
      user: userWithoutPassword
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/promote-admin')
  async promoteToAdmin(@Param('id', ParseIntPipe) id: number, @Request() req) {
    // Only admins can promote users to admin
    const currentUser = await this.usersService.findById(req.user.sub);
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can promote users to admin');
    }

    const user = await this.usersService.promoteToAdmin(id);
    const { password, ...userWithoutPassword } = user;
    
    return {
      message: 'User promoted to admin',
      user: userWithoutPassword
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/demote')
  async demoteToVoter(@Param('id', ParseIntPipe) id: number, @Request() req) {
    // Only admins can demote users
    const currentUser = await this.usersService.findById(req.user.sub);
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can demote users');
    }

    const user = await this.usersService.demoteToVoter(id);
    const { password, ...userWithoutPassword } = user;
    
    return {
      message: 'User demoted to voter',
      user: userWithoutPassword
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number, @Request() req) {
    // Only admins can delete users
    const currentUser = await this.usersService.findById(req.user.sub);
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can delete users');
    }

    // Prevent admins from deleting themselves
    if (currentUser.id === id) {
      throw new BadRequestException('You cannot delete your own account');
    }

    await this.usersService.deleteUser(id);
    
    return {
      message: 'User deleted successfully'
    };
  }
}