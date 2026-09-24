import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import { runNgslVocabularySeeder } from './contexts/vocabulary/infrastructure/seed/ngsl-seeder.service';

async function bootstrap() {
  console.log(
    'Initializing Lumen NestJS Application Context for NGSL Seeding...',
  );
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    await runNgslVocabularySeeder(dataSource);
  } catch (error) {
    console.error('NGSL Seeding Execution Error:', error);
  } finally {
    await app.close();
    console.log('NGSL Seeding process finished. Closed DB connections.');
  }
}

if (require.main === module) {
  void bootstrap();
}
