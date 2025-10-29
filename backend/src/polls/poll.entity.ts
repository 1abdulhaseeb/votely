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
import { User } from '../users/user.entity';
import { PollOption } from './poll-option.entity';
import { Vote } from './vote.entity';

@Entity('polls')
export class Poll {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: ['candidate_based', 'generic'],
    default: 'generic'
  })
  pollType: 'candidate_based' | 'generic';

  @Column({
    type: 'enum',
    enum: ['draft', 'active', 'closed'],
    default: 'draft'
  })
  status: 'draft' | 'active' | 'closed';

  @Column({ default: false })
  allowMultipleVotes: boolean;

  @Column()
  createdById: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @OneToMany(() => PollOption, option => option.poll)
  options: PollOption[];

  @OneToMany(() => Vote, vote => vote.poll)
  votes: Vote[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}