import { Module } from '@nestjs/common';
import { CandidatesController } from './candidates.controller';
import { UsersModule } from '../users/users.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [UsersModule, DatabaseModule],
  controllers: [CandidatesController],
  providers: [],
  exports: [],
})
export class CandidatesModule {}