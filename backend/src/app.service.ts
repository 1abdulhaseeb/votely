import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

@Injectable()
export class AppService {
  constructor(private readonly databaseService?: DatabaseService) {}

  async getHello(): Promise<any> {
    let dbStatus = 'Not configured';
    let dbConnection = false;

    // Check database connection if service is available
    if (this.databaseService) {
      try {
        dbConnection = await this.databaseService.checkConnection();
        dbStatus = dbConnection ? 'Connected (Neon)' : 'Configured but not connected';
      } catch (error) {
        dbStatus = 'Error connecting';
      }
    } else if (process.env.DATABASE_URL) {
      dbStatus = 'Configured but service not loaded';
    }

    return {
      message: 'Votely Backend API is running!',
      status: 'healthy',
      database: {
        status: dbStatus,
        connected: dbConnection,
        type: process.env.DATABASE_URL ? 'Neon PostgreSQL' : 'None'
      },
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    };
  }
}
