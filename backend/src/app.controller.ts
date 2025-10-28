import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly databaseService?: DatabaseService
  ) {}

  @Get()
  async getHello(): Promise<any> {
    return await this.appService.getHello();
  }

  @Get('health')
  async healthCheck(): Promise<any> {
    return await this.appService.getHello();
  }

  @Get('db-setup')
  async setupDatabase(): Promise<any> {
    if (!this.databaseService) {
      return {
        error: 'Database service not available',
        message: 'DATABASE_URL environment variable not set'
      };
    }

    try {
      await this.databaseService.initializeTables();
      return {
        message: 'Database tables initialized successfully',
        status: 'success'
      };
    } catch (error) {
      return {
        error: 'Failed to initialize database tables',
        message: error.message,
        status: 'error'
      };
    }
  }
}
