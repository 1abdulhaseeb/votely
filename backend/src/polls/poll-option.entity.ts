import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Poll } from './poll.entity';
import { User } from '../users/user.entity';
import { Vote } from './vote.entity';

@Entity('poll_options')
export class PollOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pollId: number;

  @Column()
  optionText: string;

  @Column({ nullable: true })
  candidateId?: number;

  @Column({ default: 0 })
  orderIndex: number;

  @ManyToOne(() => Poll, poll => poll.options)
  @JoinColumn({ name: 'pollId' })
  poll: Poll;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'candidateId' })
  candidate?: User;

  @OneToMany(() => Vote, vote => vote.option)
  votes: Vote[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}