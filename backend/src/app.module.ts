import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { User } from './users/user.entity';
import { Role } from './roles/role.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Only connect to database if credentials are provided
    ...(process.env.DATABASE_HOST ? [
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT || '5432'),
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: [User, Role, __dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // dev only
        logging: false,
      })
    ] : []),
    // Only include database-dependent modules if database is available
    ...(process.env.DATABASE_HOST ? [
      UsersModule,
      RolesModule,
      AuthModule,
    ] : []),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
