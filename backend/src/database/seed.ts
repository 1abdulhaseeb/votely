import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { Poll } from '../polls/poll.entity';
import { PollOption } from '../polls/poll-option.entity';
import { Vote } from '../polls/vote.entity';
import { Role } from '../roles/role.entity';
import * as bcrypt from 'bcryptjs';

export async function seedDatabase(dataSource: DataSource) {
  console.log('Starting database seeding...');

  // Create repositories
  const userRepository = dataSource.getRepository(User);
  const pollRepository = dataSource.getRepository(Poll);
  const pollOptionRepository = dataSource.getRepository(PollOption);
  const roleRepository = dataSource.getRepository(Role);

  // Create roles
  const roles = ['voter', 'candidate', 'admin'];
  for (const roleName of roles) {
    const existingRole = await roleRepository.findOne({ where: { name: roleName } });
    if (!existingRole) {
      const role = roleRepository.create({
        name: roleName,
        description: `${roleName} role`
      });
      await roleRepository.save(role);
      console.log(`Created role: ${roleName}`);
    }
  }

  // Create admin user
  const adminExists = await userRepository.findOne({ where: { role: 'admin' } });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const admin = userRepository.create({
      email: 'admin@votely.com',
      username: 'admin',
      password: hashedPassword,
      firstName: 'Admin',
      first_name: 'Admin',
      lastName: 'User',
      last_name: 'User',
      role: 'admin'
    });
    await userRepository.save(admin);
    console.log('Created admin user: admin@votely.com / admin123');
  }

  // Create some candidate users
  const candidateData = [
    { email: 'alice@example.com', username: 'alice', firstName: 'Alice', lastName: 'Johnson' },
    { email: 'bob@example.com', username: 'bob', firstName: 'Bob', lastName: 'Smith' },
    { email: 'charlie@example.com', username: 'charlie', firstName: 'Charlie', lastName: 'Brown' }
  ];

  const createdCandidates = [];
  for (const data of candidateData) {
    const exists = await userRepository.findOne({ where: { email: data.email } });
    if (!exists) {
      const hashedPassword = await bcrypt.hash('password123', 12);
      const candidate = userRepository.create({
        ...data,
        first_name: data.firstName,
        last_name: data.lastName,
        password: hashedPassword,
        role: 'candidate'
      });
      const saved = await userRepository.save(candidate);
      createdCandidates.push(saved);
      console.log(`Created candidate: ${data.email}`);
    } else {
      createdCandidates.push(exists);
    }
  }

  // Create some voter users
  const voterData = [
    { email: 'voter1@example.com', username: 'voter1', firstName: 'John', lastName: 'Doe' },
    { email: 'voter2@example.com', username: 'voter2', firstName: 'Jane', lastName: 'Doe' }
  ];

  for (const data of voterData) {
    const exists = await userRepository.findOne({ where: { email: data.email } });
    if (!exists) {
      const hashedPassword = await bcrypt.hash('password123', 12);
      const voter = userRepository.create({
        ...data,
        first_name: data.firstName,
        last_name: data.lastName,
        password: hashedPassword,
        role: 'voter'
      });
      await userRepository.save(voter);
      console.log(`Created voter: ${data.email}`);
    }
  }

  // Create a sample poll
  const admin = await userRepository.findOne({ where: { role: 'admin' } });
  if (admin) {
    const existingPoll = await pollRepository.findOne({ where: { title: 'Best Programming Language 2025' } });
    if (!existingPoll) {
      const poll = pollRepository.create({
        title: 'Best Programming Language 2025',
        description: 'Vote for the best programming language in 2025',
        pollType: 'generic',
        status: 'active',
        allowMultipleVotes: false,
        createdById: admin.id
      });
      const savedPoll = await pollRepository.save(poll);

      // Create poll options
      const options = ['TypeScript', 'Python', 'Rust', 'Go'];
      for (let i = 0; i < options.length; i++) {
        const option = pollOptionRepository.create({
          pollId: savedPoll.id,
          optionText: options[i],
          orderIndex: i
        });
        await pollOptionRepository.save(option);
      }
      console.log('Created sample poll: Best Programming Language 2025');
    }

    // Create a candidate-based poll
    const candidatePoll = await pollRepository.findOne({ where: { title: 'Student Council President 2025' } });
    if (!candidatePoll && createdCandidates.length > 0) {
      const poll = pollRepository.create({
        title: 'Student Council President 2025',
        description: 'Vote for your student council president',
        pollType: 'candidate_based',
        status: 'active',
        allowMultipleVotes: false,
        createdById: admin.id
      });
      const savedPoll = await pollRepository.save(poll);

      // Create candidate options
      for (let i = 0; i < Math.min(3, createdCandidates.length); i++) {
        const candidate = createdCandidates[i];
        const option = pollOptionRepository.create({
          pollId: savedPoll.id,
          optionText: `${candidate.firstName} ${candidate.lastName}`,
          candidateId: candidate.id,
          orderIndex: i
        });
        await pollOptionRepository.save(option);
      }
      console.log('Created candidate poll: Student Council President 2025');
    }
  }

  console.log('Database seeding completed!');
}