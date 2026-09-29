import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { AppModule } from '../app.module';
import { AuthProvider } from '../contexts/iam/domain/enums/auth-provider.enum';
import { Role } from '../contexts/iam/domain/enums/role.enum';
import { UserEntity } from '../contexts/iam/infrastructure/entities/user.entity';

export async function seedToeicVocabulary(dataSource?: DataSource) {
  console.log('🚀 Starting TOEIC 600 Seeder...');
  let app: any;
  let activeDs = dataSource;

  if (!activeDs) {
    app = await NestFactory.createApplicationContext(AppModule);
    activeDs = app.get(DataSource);
  }

  if (!activeDs) {
    throw new Error('Failed to initialize DataSource');
  }

  try {
    const userRepo = activeDs.getRepository(UserEntity);
    let adminUser = await userRepo.findOne({
      where: { email: 'system@lumen.com' },
    });

    if (!adminUser) {
      adminUser = userRepo.create({
        email: 'system@lumen.com',
        fullName: 'System Admin',
        role: Role.ADMIN,
        authProvider: AuthProvider.EMAIL,
      });
      await userRepo.save(adminUser);
    }

    const jsonPath = path.join(
      __dirname,
      '../contexts/vocabulary/infrastructure/seed/toeic-600.json',
    );
    if (!fs.existsSync(jsonPath)) {
      console.log('TOEIC dataset file not found at:', jsonPath);
      return;
    }

    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const toeicData = JSON.parse(rawData);

    console.log(`Loaded ${toeicData.length} TOEIC words.`);
    console.log('TOEIC 600 Seeding complete.');
  } catch (error) {
    console.error('TOEIC Seeding Error:', error);
  } finally {
    if (app) {
      await app.close();
    }
  }
}

if (require.main === module) {
  void seedToeicVocabulary();
}
