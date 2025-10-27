import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { RolesService } from './roles/roles.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const roles = app.get(RolesService);
  const users = app.get(UsersService);

  const adminRole = await roles.findOrCreate('admin');
  const userRole = await roles.findOrCreate('user');

  // create admin if not exists
  const adminEmail = 'admin@test.com';
  let admin = await users.findByEmail(adminEmail);
  if (!admin) {
    const password = 'Test123';
    admin = await users.createUser(adminEmail, password, 'admin');
    console.log('Admin created:', adminEmail, 'password:', password);
  } else {
    console.log('Admin exists:', adminEmail);
  }
  await app.close();
}

bootstrap().catch((e) => {
  console.error(e);
  process.exit(1);
});