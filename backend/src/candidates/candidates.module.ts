import { Module } from '@nestjs/common';
import { CandidatesController } from './candidates.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CandidatesController],
  providers: [],
  exports: [],
})
export class CandidatesModule {}