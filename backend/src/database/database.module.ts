import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';
import { User } from '../users/user.entity';
import { Poll } from '../polls/poll.entity';
import { PollOption } from '../polls/poll-option.entity';
import { Vote } from '../polls/vote.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Poll, PollOption, Vote])
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}