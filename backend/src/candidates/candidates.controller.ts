import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('candidates')
export class CandidatesController {
  constructor(private readonly databaseService: DatabaseService) {}

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getCandidateStats(@Request() req) {
    try {
      const user = await this.databaseService.findUserById(req.user.sub);
      if (!user || user.role !== 'candidate') {
        throw new ForbiddenException('Only candidates can view their stats');
      }

      const stats = await this.databaseService.getCandidateStats(user.id);
      
      return {
        candidate: {
          id: user.id,
          username: user.username,
          firstName: user.first_name,
          lastName: user.last_name
        },
        stats: stats
      };
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch candidate stats');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('polls')
  async getCandidatePolls(@Request() req) {
    try {
      const user = await this.databaseService.findUserById(req.user.sub);
      if (!user || user.role !== 'candidate') {
        throw new ForbiddenException('Only candidates can view their polls');
      }

      // Get polls where this candidate is an option
      const polls = await this.databaseService.getCandidatePolls(user.id);

      return polls;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch candidate polls');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('polls/:id/results')
  async getCandidatePollResults(@Param('id') pollId: string, @Request() req) {
    try {
      const user = await this.databaseService.findUserById(req.user.sub);
      if (!user || user.role !== 'candidate') {
        throw new ForbiddenException('Only candidates can view poll results');
      }

      const id = parseInt(pollId);
      
      // Check if candidate is part of this poll
      const isCandidateInPoll = await this.databaseService.isCandidateInPoll(id, user.id);
      
      if (!isCandidateInPoll) {
        throw new ForbiddenException('You are not a candidate in this poll');
      }

      // Get poll results
      const results = await this.databaseService.getPollResults(id);
      const poll = await this.databaseService.findPollById(id);

      return {
        poll: poll,
        results: results
      };
    } catch (error) {
      if (error instanceof ForbiddenException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch poll results');
    }
  }

  // Admin endpoint to promote user to candidate
  @UseGuards(JwtAuthGuard)
  @Put(':id/promote')
  async promoteToCandidate(@Param('id') userId: string, @Request() req) {
    try {
      const admin = await this.databaseService.findUserById(req.user.sub);
      if (!admin || admin.role !== 'admin') {
        throw new ForbiddenException('Only admins can promote users to candidates');
      }

      const user = await this.databaseService.updateUserRole(parseInt(userId), 'candidate');
      if (!user) {
        throw new NotFoundException('User not found');
      }

      return {
        message: 'User promoted to candidate successfully',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      };
    } catch (error) {
      if (error instanceof ForbiddenException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to promote user');
    }
  }

  // Admin endpoint to get all candidates
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllCandidates(@Request() req) {
    try {
      const admin = await this.databaseService.findUserById(req.user.sub);
      if (!admin || admin.role !== 'admin') {
        throw new ForbiddenException('Only admins can view all candidates');
      }

      const candidates = await this.databaseService.getUsersByRole('candidate');
      
      return candidates;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch candidates');
    }
  }
}