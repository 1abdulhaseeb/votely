import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import type { VercelRequest, VercelResponse } from '@vercel/node';

let app: any;

async function createApp() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    
    // Enable CORS for frontend communication
    app.enableCors({
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-frontend-domain.vercel.app'] // Replace with your actual frontend URL
        : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3001'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: false,
    });
    
    await app.init();
  }
  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const app = await createApp();
  return app.getHttpAdapter().getInstance()(req, res);
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    
    app.enableCors({
      origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3001'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: false,
    });
    
    await app.listen(process.env.PORT ?? 3000);
  }
  bootstrap();
}
