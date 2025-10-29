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
import { UsersService } from '../users/users.service';
import { DatabaseService } from '../database/database.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from '../users/user.entity';

@Controller('candidates')
export class CandidatesController {
  constructor(
    private readonly usersService: UsersService,
    private readonly databaseService: DatabaseService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getCandidateStats(@Request() req) {
    try {
      const user = await this.usersService.findById(req.user.sub);
      if (!user || user.role !== UserRole.CANDIDATE) {
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
      const user = await this.usersService.findById(req.user.sub);
      if (!user || user.role !== UserRole.CANDIDATE) {
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
      const user = await this.usersService.findById(req.user.sub);
      if (!user || user.role !== UserRole.CANDIDATE) {
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


}