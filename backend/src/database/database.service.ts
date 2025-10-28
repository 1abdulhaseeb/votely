import { neon } from '@neondatabase/serverless';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
  private readonly sql;

  constructor(private configService: ConfigService) {
    const databaseUrl = this.configService.get('DATABASE_URL');
    if (databaseUrl) {
      this.sql = neon(databaseUrl);
    }
  }

  // Health check method
  async checkConnection(): Promise<boolean> {
    if (!this.sql) {
      return false;
    }
    try {
      await this.sql`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return false;
    }
  }

  // Example query method
  async getData() {
    if (!this.sql) {
      throw new Error('Database not configured');
    }
    const data = await this.sql`SELECT NOW() as current_time`;
    return data;
  }

  // Users table operations
  async createUsersTable() {
    if (!this.sql) {
      throw new Error('Database not configured');
    }
    await this.sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
  }

  async createRolesTable() {
    if (!this.sql) {
      throw new Error('Database not configured');
    }
    await this.sql`
      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
  }

  async createUserRolesTable() {
    if (!this.sql) {
      throw new Error('Database not configured');
    }
    await this.sql`
      CREATE TABLE IF NOT EXISTS user_roles (
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, role_id)
      )
    `;
  }

  // Initialize database tables
  async initializeTables() {
    if (!this.sql) {
      console.log('Database not configured, skipping table initialization');
      return;
    }
    
    try {
      await this.createUsersTable();
      await this.createRolesTable();
      await this.createUserRolesTable();
      console.log('Database tables initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database tables:', error);
      throw error;
    }
  }

  // User operations
  async findUserByEmail(email: string) {
    if (!this.sql) {
      return null;
    }
    const users = await this.sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    return users[0] || null;
  }

  async createUser(email: string, hashedPassword: string, name?: string) {
    if (!this.sql) {
      throw new Error('Database not configured');
    }
    const users = await this.sql`
      INSERT INTO users (email, password, name)
      VALUES (${email}, ${hashedPassword}, ${name})
      RETURNING *
    `;
    return users[0];
  }

  async findUserById(id: number) {
    if (!this.sql) {
      return null;
    }
    const users = await this.sql`
      SELECT * FROM users WHERE id = ${id}
    `;
    return users[0] || null;
  }

  // Role operations
  async createRole(name: string, description?: string) {
    if (!this.sql) {
      throw new Error('Database not configured');
    }
    const roles = await this.sql`
      INSERT INTO roles (name, description)
      VALUES (${name}, ${description})
      RETURNING *
    `;
    return roles[0];
  }

  async findRoleByName(name: string) {
    if (!this.sql) {
      return null;
    }
    const roles = await this.sql`
      SELECT * FROM roles WHERE name = ${name}
    `;
    return roles[0] || null;
  }
}