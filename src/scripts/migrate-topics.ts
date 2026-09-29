import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from '../app.module';
import {
  NGSL_DATASETS,
  assignSubTopic,
} from '../contexts/vocabulary/infrastructure/seed/ngsl-datasets.config';

export async function runTopicMigration(dataSource: DataSource): Promise<void> {
  console.log('--- Starting vocab_topics Table & Relational Migration ---');

  // 1. DDL: Ensure vocab_topics table and topicId column exist
  await dataSource.query(`
    CREATE TABLE IF NOT EXISTS vocab_topics (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "folderId" UUID NOT NULL REFERENCES vocab_folders(id) ON DELETE CASCADE,
      name JSONB NOT NULL DEFAULT '{}',
      "imageUrl" VARCHAR(1000),
      "orderIndex" INT DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      deleted_at TIMESTAMP WITH TIME ZONE
    );
    CREATE INDEX IF NOT EXISTS idx_topics_folder_id ON vocab_topics("folderId");
    ALTER TABLE vocab_flashcards ADD COLUMN IF NOT EXISTS "topicId" UUID REFERENCES vocab_topics(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS idx_flashcards_topic_id ON vocab_flashcards("topicId");
  `);
  console.log('✓ DDL: vocab_topics table & topicId index ensured.');

  // 2. For each system dataset, seed topics into vocab_topics and link flashcards
  for (const dataset of NGSL_DATASETS) {
    console.log(`\nProcessing Topics for Folder: ${dataset.name.en}...`);

    // Find folder
    const folderRows: { id: string }[] = await dataSource.query(
      `SELECT id FROM vocab_folders WHERE name->>'en' = $1 AND "isSystem" = true LIMIT 1`,
      [dataset.name.en],
    );
    if (!folderRows.length) {
      console.log(`  Folder ${dataset.name.en} not found in DB. Skipping.`);
      continue;
    }
    const folderId = folderRows[0].id;

    // Seed topics into vocab_topics
    const topicMap = new Map<string, string>(); // en -> id
    for (let sIdx = 0; sIdx < dataset.subTopics.length; sIdx++) {
      const st = dataset.subTopics[sIdx];
      const nameJson = JSON.stringify({ en: st.en, vi: st.vi });

      const existingTopic: { id: string }[] = await dataSource.query(
        `SELECT id FROM vocab_topics WHERE "folderId" = $1 AND name->>'en' = $2 LIMIT 1`,
        [folderId, st.en],
      );

      let topicId: string;
      if (existingTopic.length > 0) {
        topicId = existingTopic[0].id;
        await dataSource.query(
          `UPDATE vocab_topics SET name = $1::jsonb, "imageUrl" = $2, "orderIndex" = $3, updated_at = NOW() WHERE id = $4`,
          [nameJson, st.imageUrl, sIdx, topicId],
        );
      } else {
        const inserted: { id: string }[] = await dataSource.query(
          `INSERT INTO vocab_topics (id, "folderId", name, "imageUrl", "orderIndex", created_at, updated_at)
           VALUES (gen_random_uuid(), $1, $2::jsonb, $3, $4, NOW(), NOW())
           RETURNING id`,
          [folderId, nameJson, st.imageUrl, sIdx],
        );
        topicId = inserted[0].id;
      }
      topicMap.set(st.en, topicId);
    }
    console.log(
      `  ✓ Ensured ${dataset.subTopics.length} topics in vocab_topics for ${dataset.name.en}.`,
    );

    // Fetch all flashcards with their words in this folder
    const flashcards: { id: string; term: string }[] = await dataSource.query(
      `SELECT fc.id, w.term
       FROM vocab_flashcards fc
       JOIN vocab_words w ON w.id = fc."wordId"
       WHERE fc."folderId" = $1`,
      [folderId],
    );

    console.log(
      `  Found ${flashcards.length} flashcards to re-classify and link...`,
    );
    let updatedCount = 0;

    const chunkSize = 200;
    for (let i = 0; i < flashcards.length; i += chunkSize) {
      const chunk = flashcards.slice(i, i + chunkSize);
      const updates = chunk
        .map((fc, idx) => {
          const subTopic = assignSubTopic(
            dataset,
            i + idx,
            flashcards.length,
            fc.term,
          );
          const topicId = topicMap.get(subTopic.en);
          return {
            id: fc.id,
            topicId,
            topic: JSON.stringify({ en: subTopic.en, vi: subTopic.vi }),
            topicImageUrl: subTopic.imageUrl,
          };
        })
        .filter((u) => Boolean(u.topicId));

      if (updates.length > 0) {
        const placeholders = updates
          .map(
            (_, idx) =>
              `($${idx * 4 + 1}::uuid, $${idx * 4 + 2}::uuid, $${idx * 4 + 3}::jsonb, $${idx * 4 + 4}::text)`,
          )
          .join(', ');
        const params: string[] = [];
        updates.forEach((u) =>
          params.push(u.id, u.topicId!, u.topic, u.topicImageUrl),
        );

        await dataSource.query(
          `UPDATE vocab_flashcards AS fc
           SET 
             "topicId" = v.topic_id,
             topic = v.topic,
             "topicImageUrl" = v.topic_image_url
           FROM (VALUES ${placeholders}) AS v(id, topic_id, topic, topic_image_url)
           WHERE fc.id = v.id`,
          params,
        );
        updatedCount += updates.length;
      }
    }
    console.log(
      `  ✓ Successfully updated ${updatedCount} flashcards with authentic topicId for ${dataset.name.en}.`,
    );
  }

  // 3. For any remaining custom or legacy flashcards with non-null topic, backfill vocab_topics
  const unlinkedFlashcards: {
    id: string;
    folderId: string;
    topicEn: string;
    topicVi: string | null;
    topicImageUrl: string | null;
  }[] = await dataSource.query(`
    SELECT 
      fc.id,
      fc."folderId",
      COALESCE(fc.topic->>'en', fc.topic #>> '{}') AS "topicEn",
      fc.topic->>'vi' AS "topicVi",
      fc."topicImageUrl"
    FROM vocab_flashcards fc
    WHERE fc."topicId" IS NULL AND (fc.topic IS NOT NULL OR fc."topicImageUrl" IS NOT NULL)
  `);

  if (unlinkedFlashcards.length > 0) {
    console.log(
      `\nBackfilling ${unlinkedFlashcards.length} unlinked legacy flashcards...`,
    );
    const customTopicMap = new Map<string, string>(); // `${folderId}::${topicEn}` -> topicId

    for (const fc of unlinkedFlashcards) {
      const topicEn = (fc.topicEn || 'General').trim();
      const topicVi = fc.topicVi ? fc.topicVi.trim() : topicEn;
      const key = `${fc.folderId}::${topicEn}`;

      let topicId = customTopicMap.get(key);
      if (!topicId) {
        const existing: { id: string }[] = await dataSource.query(
          `SELECT id FROM vocab_topics WHERE "folderId" = $1 AND name->>'en' = $2 LIMIT 1`,
          [fc.folderId, topicEn],
        );
        if (existing.length > 0) {
          topicId = existing[0].id;
        } else {
          const inserted: { id: string }[] = await dataSource.query(
            `INSERT INTO vocab_topics (id, "folderId", name, "imageUrl", "orderIndex", created_at, updated_at)
             VALUES (gen_random_uuid(), $1, $2::jsonb, $3, 99, NOW(), NOW())
             RETURNING id`,
            [
              fc.folderId,
              JSON.stringify({ en: topicEn, vi: topicVi }),
              fc.topicImageUrl,
            ],
          );
          topicId = inserted[0].id;
        }
        customTopicMap.set(key, topicId);
      }

      await dataSource.query(
        `UPDATE vocab_flashcards SET "topicId" = $1 WHERE id = $2`,
        [topicId, fc.id],
      );
    }
    console.log(`✓ Backfilled all unlinked legacy flashcards.`);
  }

  console.log(
    '\n--- vocab_topics Relational Migration Completed Successfully ---',
  );
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    await runTopicMigration(dataSource);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await app.close();
  }
}

if (require.main === module) {
  void bootstrap();
}
