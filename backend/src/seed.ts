import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { UserRole } from './users/user.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const usersService = app.get(UsersService);

  console.log('🌱 Starting database seeding...');

  try {
    // Create admin user
    try {
      const admin = await usersService.createUser(
        'admin@votely.com',
        'admin123',
        'admin',
        'Admin',
        'User',
        UserRole.ADMIN
      );
      console.log('✅ Created admin user:', admin.email);
    } catch (error: any) {
      if (error.message.includes('already')) {
        console.log('⚠️  Admin user already exists');
      } else {
        throw error;
      }
    }

    // Create some test candidates
    const candidates = [
      {
        email: 'alice.smith@example.com',
        username: 'alice_smith',
        firstName: 'Alice',
        lastName: 'Smith',
        password: 'password123'
      },
      {
        email: 'bob.johnson@example.com',
        username: 'bob_johnson',
        firstName: 'Bob',
        lastName: 'Johnson',
        password: 'password123'
      },
      {
        email: 'carol.davis@example.com',
        username: 'carol_davis',
        firstName: 'Carol',
        lastName: 'Davis',
        password: 'password123'
      },
      {
        email: 'david.wilson@example.com',
        username: 'david_wilson',
        firstName: 'David',
        lastName: 'Wilson',
        password: 'password123'
      },
      {
        email: 'eva.brown@example.com',
        username: 'eva_brown',
        firstName: 'Eva',
        lastName: 'Brown',
        password: 'password123'
      }
    ];

    for (const candidateData of candidates) {
      try {
        const user = await usersService.createUser(
          candidateData.email,
          candidateData.password,
          candidateData.username,
          candidateData.firstName,
          candidateData.lastName,
          UserRole.CANDIDATE
        );
        console.log('✅ Created candidate:', user.email);
      } catch (error: any) {
        if (error.message.includes('already')) {
          console.log('⚠️  Candidate already exists:', candidateData.email);
        } else {
          throw error;
        }
      }
    }

    // Create some test voters
    const voters = [
      {
        email: 'voter1@example.com',
        username: 'voter1',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123'
      },
      {
        email: 'voter2@example.com',
        username: 'voter2',
        firstName: 'Jane',
        lastName: 'Doe',
        password: 'password123'
      },
      {
        email: 'voter3@example.com',
        username: 'voter3',
        firstName: 'Mike',
        lastName: 'Test',
        password: 'password123'
      }
    ];

    for (const voterData of voters) {
      try {
        const user = await usersService.createUser(
          voterData.email,
          voterData.password,
          voterData.username,
          voterData.firstName,
          voterData.lastName,
          UserRole.VOTER
        );
        console.log('✅ Created voter:', user.email);
      } catch (error: any) {
        if (error.message.includes('already')) {
          console.log('⚠️  Voter already exists:', voterData.email);
        } else {
          throw error;
        }
      }
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('Test users created:');
    console.log('Admin: admin@votely.com / admin123');
    console.log('Candidates: alice.smith@example.com, bob.johnson@example.com, etc. / password123');
    console.log('Voters: voter1@example.com, voter2@example.com, etc. / password123');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }

  await app.close();
}

bootstrap().catch((error) => {
  console.error('❌ Bootstrap failed:', error);
  process.exit(1);
});