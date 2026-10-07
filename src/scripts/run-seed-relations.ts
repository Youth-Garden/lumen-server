import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from '../app.module';
import { seedWordRelations } from './seed-word-relations';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  await seedWordRelations(dataSource);
  await app.close();
}

run().catch((err) => {
  console.error('Failed to run relations seeder:', err);
  process.exit(1);
});
