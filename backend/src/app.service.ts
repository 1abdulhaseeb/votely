import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    const dbStatus = process.env.DATABASE_HOST ? 'Connected' : 'Not configured';
    return {
      message: 'Votely Backend API is running!',
      status: 'healthy',
      database: dbStatus,
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    };
  }
}
