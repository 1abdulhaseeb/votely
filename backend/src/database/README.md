# Database Setup Guide

## Neon Database for Production (Vercel)

### 1. Create a Neon Account
- Go to [neon.tech](https://neon.tech)
- Sign up for a free account
- Create a new project

### 2. Get Database URL
- In your Neon dashboard, go to your project
- Click on "Connection Details"
- Copy the connection string (it looks like: `postgresql://username:password@hostname:port/database`)

### 3. Configure Vercel Environment Variables
Add this environment variable in your Vercel project settings:
- `DATABASE_URL`: Your Neon connection string

### 4. Initialize Database Tables
After deployment, visit your deployed app's `/db-setup` endpoint to create the necessary tables:
```
https://your-app.vercel.app/db-setup
```

## Local Development

### Option 1: Docker (Recommended)
Use the existing Docker setup:
```bash
yarn docker:dev
```

### Option 2: Local PostgreSQL
1. Install PostgreSQL locally
2. Create a database named `votely`
3. Copy `.env.example` to `.env`
4. Update the DATABASE_ variables with your local settings

## API Endpoints

- `GET /` - API status and database connection info
- `GET /health` - Health check endpoint
- `GET /db-setup` - Initialize database tables (production only)

## Database Service

The `DatabaseService` provides methods for:
- Connection health checks
- Table initialization
- User management
- Role management

It automatically detects whether to use:
- Neon (when `DATABASE_URL` is set) - for production
- TypeORM (when `DATABASE_HOST` is set) - for local development