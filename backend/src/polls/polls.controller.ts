import {
  Controller,
  Get,
  Post,
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
import { UserRole } from '../users/user.entity';

interface CreatePollDto {
  title: string;
  description: string;
  pollType: 'candidate_based' | 'generic';
  allowMultipleVotes?: boolean;
  options: Array<{
    optionText: string;
    candidateId?: number;
  }>;
}

interface VoteDto {
  optionId: number;
}

@Controller('polls')
export class PollsController {
  constructor(private readonly databaseService: DatabaseService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPoll(@Body() createPollDto: CreatePollDto, @Request() req) {
    // Only admins can create polls
    const user = await this.databaseService.findUserById(req.user.sub);
    if (!user || user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can create polls');
    }

    const { title, description, pollType, allowMultipleVotes = false, options } = createPollDto;

    if (!title || !description || !options || options.length < 2) {
      throw new BadRequestException('Poll must have title, description, and at least 2 options');
    }

    try {
      // Create poll
      const poll = await this.databaseService.createPoll(
        title,
        description,
        pollType,
        user.id,
        allowMultipleVotes
      );

      // Create poll options
      for (let i = 0; i < options.length; i++) {
        const option = options[i];
        await this.databaseService.createPollOption(
          poll.id,
          option.optionText,
          option.candidateId,
          i
        );
      }

      return {
        message: 'Poll created successfully',
        poll: poll
      };
    } catch (error) {
      throw new BadRequestException('Failed to create poll');
    }
  }

  @Get()
  async getAllPolls() {
    try {
      const polls = await this.databaseService.getAllPolls();
      
      // Fetch options and vote counts for each poll
      const pollsWithStats = await Promise.all(
        polls.map(async (poll) => {
          const options = await this.databaseService.getPollOptions(poll.id);
          const results = await this.databaseService.getPollResults(poll.id);
          
          // Calculate total votes
          const totalVotes = results.reduce((sum, result) => sum + result.voteCount, 0);
          
          return {
            ...poll,
            options,
            totalVotes,
            results
          };
        })
      );
      
      return pollsWithStats;
    } catch (error) {
      throw new BadRequestException('Failed to fetch polls');
    }
  }

  @Get(':id')
  async getPoll(@Param('id') id: string) {
    try {
      const poll = await this.databaseService.findPollById(parseInt(id));
      if (!poll) {
        throw new NotFoundException('Poll not found');
      }

      const options = await this.databaseService.getPollOptions(poll.id);
      
      return {
        ...poll,
        options
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch poll');
    }
  }

  @Get(':id/results')
  async getPollResults(@Param('id') id: string) {
    try {
      const poll = await this.databaseService.findPollById(parseInt(id));
      if (!poll) {
        throw new NotFoundException('Poll not found');
      }

      const results = await this.databaseService.getPollResults(poll.id);
      
      return {
        poll: poll,
        results: results
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch poll results');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/my-vote')
  async getMyVote(@Param('id') id: string, @Request() req) {
    try {
      const pollId = parseInt(id);
      const user = await this.databaseService.findUserById(req.user.sub);
      
      if (!user) {
        throw new ForbiddenException('User not found');
      }

      const vote = await this.databaseService.getUserVote(pollId, user.id);
      
      return {
        hasVoted: !!vote,
        vote: vote
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch user vote');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/vote')
  async vote(@Param('id') id: string, @Body() voteDto: VoteDto, @Request() req) {
    try {
      const pollId = parseInt(id);
      const { optionId } = voteDto;

      // Get user
      const user = await this.databaseService.findUserById(req.user.sub);
      if (!user) {
        throw new ForbiddenException('User not found');
      }

      // Only voters can vote
      if (user.role !== UserRole.VOTER) {
        throw new ForbiddenException('Only voters can vote');
      }

      // Check if poll exists and is active
      const poll = await this.databaseService.findPollById(pollId);
      if (!poll) {
        throw new NotFoundException('Poll not found');
      }

      if (poll.status !== 'active') {
        throw new BadRequestException('Poll is not active');
      }

      // Check if user has already voted (for non-multiple vote polls)
      if (!poll.allowMultipleVotes) {
        const hasVoted = await this.databaseService.hasUserVoted(pollId, user.id);
        if (hasVoted) {
          throw new BadRequestException('You have already voted in this poll');
        }
      }

      // Cast vote
      const vote = await this.databaseService.createVote(pollId, user.id, optionId);

      return {
        message: 'Vote cast successfully',
        vote: vote
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to cast vote');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/status')
  async updatePollStatus(@Param('id') id: string, @Body() statusDto: { status: string }, @Request() req) {
    // Only admins can update poll status
    const user = await this.databaseService.findUserById(req.user.sub);
    if (!user || user.role !== 'admin') {
      throw new ForbiddenException('Only admins can update poll status');
    }

    const { status } = statusDto;
    if (!['draft', 'active', 'closed'].includes(status)) {
      throw new BadRequestException('Invalid status');
    }

    try {
      const poll = await this.databaseService.updatePollStatus(parseInt(id), status as 'draft' | 'active' | 'closed');
      if (!poll) {
        throw new NotFoundException('Poll not found');
      }

      return {
        message: 'Poll status updated successfully',
        poll: poll
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to update poll status');
    }
  }
}