import { Module } from '@nestjs/common';
import { PollsController } from './polls.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PollsController],
  providers: [],
  exports: [],
})
export class PollsModule {}