import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import { Poll } from '../polls/poll.entity';
import { PollOption } from '../polls/poll-option.entity';
import { Vote } from '../polls/vote.entity';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Poll)
    private pollRepository: Repository<Poll>,
    @InjectRepository(PollOption)
    private pollOptionRepository: Repository<PollOption>,
    @InjectRepository(Vote)
    private voteRepository: Repository<Vote>,
  ) {}

  // User methods
  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async createUser(
    email: string,
    password: string,
    username: string,
    firstName?: string,
    lastName?: string,
    role: UserRole = UserRole.VOTER
  ): Promise<User> {
    const user = this.userRepository.create({
      email,
      password,
      username,
      firstName,
      first_name: firstName,
      lastName,
      last_name: lastName,
      role,
    });
    return this.userRepository.save(user);
  }

  async updateUserRole(userId: number, role: UserRole): Promise<User | null> {
    await this.userRepository.update(userId, { role });
    return this.findUserById(userId);
  }

  async getUsersByRole(role: UserRole): Promise<User[]> {
    return this.userRepository.find({ where: { role } });
  }

  // Poll methods
  async createPoll(
    title: string,
    description: string,
    pollType: 'candidate_based' | 'generic',
    createdById: number,
    allowMultipleVotes: boolean = false
  ): Promise<Poll> {
    const poll = this.pollRepository.create({
      title,
      description,
      pollType,
      createdById,
      allowMultipleVotes,
      status: 'draft'
    });
    return this.pollRepository.save(poll);
  }

  async getAllPolls(status?: 'draft' | 'active' | 'closed'): Promise<Poll[]> {
    const whereCondition = status ? { status } : {};
    return this.pollRepository.find({
      where: whereCondition,
      relations: ['createdBy'],
      order: { createdAt: 'DESC' }
    });
  }

  async findPollById(id: number): Promise<Poll | null> {
    return this.pollRepository.findOne({
      where: { id },
      relations: ['createdBy']
    });
  }

  async updatePollStatus(id: number, status: 'draft' | 'active' | 'closed'): Promise<Poll | null> {
    await this.pollRepository.update(id, { status });
    return this.findPollById(id);
  }

  // Poll Option methods
  async createPollOption(
    pollId: number,
    optionText: string,
    candidateId?: number,
    orderIndex: number = 0
  ): Promise<PollOption> {
    const option = this.pollOptionRepository.create({
      pollId,
      optionText,
      candidateId,
      orderIndex
    });
    return this.pollOptionRepository.save(option);
  }

  async getPollOptions(pollId: number): Promise<PollOption[]> {
    return this.pollOptionRepository.find({
      where: { pollId },
      relations: ['candidate'],
      order: { orderIndex: 'ASC' }
    });
  }

  // Vote methods
  async createVote(pollId: number, userId: number, optionId: number): Promise<Vote> {
    const vote = this.voteRepository.create({
      pollId,
      userId,
      optionId
    });
    return this.voteRepository.save(vote);
  }

  async hasUserVoted(pollId: number, userId: number): Promise<boolean> {
    const vote = await this.voteRepository.findOne({
      where: { pollId, userId }
    });
    return !!vote;
  }

  async getUserVote(pollId: number, userId: number): Promise<Vote | null> {
    return this.voteRepository.findOne({
      where: { pollId, userId }
    });
  }

  async getPollResults(pollId: number): Promise<any[]> {
    const results = await this.voteRepository
      .createQueryBuilder('vote')
      .select('vote.optionId', 'optionId')
      .addSelect('option.optionText', 'optionText')
      .addSelect('COUNT(vote.id)', 'voteCount')
      .leftJoin('poll_options', 'option', 'option.id = vote.optionId')
      .where('vote.pollId = :pollId', { pollId })
      .groupBy('vote.optionId')
      .addGroupBy('option.optionText')
      .getRawMany();

    return results.map(result => ({
      optionId: result.optionId,
      optionText: result.optionText,
      voteCount: parseInt(result.voteCount)
    }));
  }

  // Candidate specific methods
  async getCandidateStats(candidateId: number): Promise<any> {
    const totalPolls = await this.pollOptionRepository.count({
      where: { candidateId }
    });

    const totalVotes = await this.voteRepository
      .createQueryBuilder('vote')
      .leftJoin('poll_options', 'option', 'option.id = vote.optionId')
      .where('option.candidateId = :candidateId', { candidateId })
      .getCount();

    return {
      totalPolls,
      totalVotes
    };
  }

  async getCandidatePolls(candidateId: number): Promise<Poll[]> {
    return this.pollRepository
      .createQueryBuilder('poll')
      .leftJoin('poll_options', 'option', 'option.pollId = poll.id')
      .where('option.candidateId = :candidateId', { candidateId })
      .getMany();
  }

  async isCandidateInPoll(pollId: number, candidateId: number): Promise<boolean> {
    const option = await this.pollOptionRepository.findOne({
      where: { pollId, candidateId }
    });
    return !!option;
  }
}