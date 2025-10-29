import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Poll } from './poll.entity';
import { PollOption } from './poll-option.entity';
import { User } from '../users/user.entity';

@Entity('votes')
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pollId: number;

  @Column()
  userId: number;

  @Column()
  optionId: number;

  @ManyToOne(() => Poll, poll => poll.votes)
  @JoinColumn({ name: 'pollId' })
  poll: Poll;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => PollOption, option => option.votes)
  @JoinColumn({ name: 'optionId' })
  option: PollOption;

  @CreateDateColumn()
  createdAt: Date;
}