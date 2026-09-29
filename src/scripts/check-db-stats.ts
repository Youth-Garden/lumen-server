import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from '../app.module';

async function checkAudioStats() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const [totalRes] = await dataSource.query(
    `SELECT COUNT(*) FROM vocab_words;`,
  );
  const [audioUsRes] = await dataSource.query(
    `SELECT COUNT(*) FROM vocab_words WHERE "audioUsUrl" IS NOT NULL;`,
  );
  const [audioUkRes] = await dataSource.query(
    `SELECT COUNT(*) FROM vocab_words WHERE "audioUkUrl" IS NOT NULL;`,
  );
  const [missingBothRes] = await dataSource.query(
    `SELECT COUNT(*) FROM vocab_words WHERE "audioUsUrl" IS NULL AND "audioUkUrl" IS NULL;`,
  );

  console.log('====================================');
  console.log('🔊 AUDIO COVERAGE STATS:');
  console.log('====================================');
  console.log(`- Total Words: ${totalRes.count}`);
  console.log(`- Words with Audio US: ${audioUsRes.count}`);
  console.log(`- Words with Audio UK: ${audioUkRes.count}`);
  console.log(`- Words Missing Both Audio: ${missingBothRes.count}`);
  console.log('====================================');

  await app.close();
}

checkAudioStats().catch(console.error);
