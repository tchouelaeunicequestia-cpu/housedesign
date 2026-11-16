import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user/user.service';
import { EngineerProfileService } from './engineer-profile/engineer-profile.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userService = app.get(UserService);
  const engineerProfileService = app.get(EngineerProfileService);

  console.log('Seeding database...');

  // 1. Seed default Admin / Engineer user if not exists
  const adminEmail = process.env.ADMIN_DEFAULT_EMAIL;
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD;
  if (!adminEmail || !adminPassword) {
    console.error(
      'Set ADMIN_DEFAULT_EMAIL and ADMIN_DEFAULT_PASSWORD (a strong password) before seeding.',
    );
    await app.close();
    process.exit(1);
  }
  const adminUsername = 'admin';

  try {
    const existingUser = await userService.findByUsername(adminUsername);
    if (!existingUser) {
      await userService.register({
        username: adminUsername,
        email: adminEmail,
        password: adminPassword,
      });
      console.log(`Created default admin user: ${adminEmail}`);
    } else {
      console.log('Admin user already exists.');
    }
  } catch (error) {
    console.error('Error seeding user:', error);
  }

  // 2. Seed default engineer profile if not exists
  try {
    const existingProfile = await engineerProfileService.getProfile();
    if (!existingProfile) {
      await engineerProfileService.updateProfile({
        name: 'Ing. Tchouela Eunice',
        title: 'Lead Structural & Civil Engineer',
        bio: 'With over a decade of hands-on structural design, foundation analysis, and precision construction supervision across Cameroon, I ensure state-of-the-art durability, seismic stability, and modern aesthetics.',
        history: 'Founded House Design with a clear mission: provide robust architectural solutions, structural validation, and trustworthy asset acquisition for commercial and residential landmarks.',
        experienceYears: 12,
        completedProjectsCount: 65,
        photoUrl: '',
      });
      console.log('Created default engineer profile.');
    } else {
      console.log('Engineer profile already exists.');
    }
  } catch (error) {
    console.error('Error seeding engineer profile:', error);
  }

  console.log('Seeding completed.');
  await app.close();
}

bootstrap();
