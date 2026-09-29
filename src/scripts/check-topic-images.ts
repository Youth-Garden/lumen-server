import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from '../app.module';

async function check() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const ds = app.get(DataSource);

  const duplicateImages: Array<{
    imageUrl: string;
    cnt: string;
    topicNames: string[];
  }> = await ds.query(`
    SELECT "imageUrl", COUNT(*) as cnt, array_agg(name->>'en') as "topicNames"
    FROM vocab_topics
    GROUP BY "imageUrl"
    HAVING COUNT(*) > 1
    ORDER BY cnt DESC
  `);

  console.log(
    `Found ${duplicateImages.length} image URLs shared across multiple topics:`,
  );
  for (const row of duplicateImages) {
    console.log(`- Image: ${row.imageUrl}`);
    console.log(`  Count: ${row.cnt}`);
    console.log(`  Topics: ${row.topicNames.join(' | ')}`);
  }

  const allTopics: Array<{ id: string; nameEn: string; imageUrl: string }> =
    await ds.query(`
    SELECT id, name->>'en' as "nameEn", "imageUrl"
    FROM vocab_topics
    ORDER BY "orderIndex" ASC
  `);
  console.log(`\nTotal topics in DB: ${allTopics.length}`);

  await app.close();
}

check().catch((err) => {
  console.error(err);
  process.exit(1);
});
