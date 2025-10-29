import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { Poll } from './polls/poll.entity';
import { PollOption } from './polls/poll-option.entity';
import { Vote } from './polls/vote.entity';
import { PollsModule } from './polls/polls.module';
import { CandidatesModule } from './candidates/candidates.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Poll, PollOption, Vote],
      synchronize: true, // dev only
      logging: false,
    }),
    UsersModule,
    AuthModule,
    PollsModule,
    CandidatesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
