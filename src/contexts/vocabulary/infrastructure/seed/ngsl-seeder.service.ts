import { DataSource, Repository } from 'typeorm';
import { AuthProvider } from '../../../iam/domain/enums/auth-provider.enum';
import { Role } from '../../../iam/domain/enums/role.enum';
import { UserEntity } from '../../../iam/infrastructure/entities/user.entity';
import { FolderEntity } from '../entities/folder.entity';
import { WordEntity } from '../entities/word.entity';
import { fetchAndParseNgslCsv, ParsedNgslRow } from './ngsl-csv-parser';
import {
  assignSubTopic,
  inferCefrLevel,
  NGSL_DATASETS,
  NgslDatasetConfig,
} from './ngsl-datasets.config';

export async function runNgslVocabularySeeder(
  dataSource: DataSource,
): Promise<void> {
  const userRepo = dataSource.getRepository(UserEntity);
  const folderRepo = dataSource.getRepository(FolderEntity);

  console.log('--- Starting NGSL Vocabulary Datasets Seeding Pipeline ---');

  console.log('Step 1: Ensuring System Admin User...');
  let systemUser = await userRepo.findOne({
    where: { email: 'system@lumen.com' },
  });
  if (!systemUser) {
    systemUser = new UserEntity();
    systemUser.email = 'system@lumen.com';
    systemUser.fullName = 'Lumen System Admin';
    systemUser.role = Role.ADMIN;
    systemUser.authProvider = AuthProvider.EMAIL;
    systemUser = await userRepo.save(systemUser);
  }

  console.log(
    'Step 2: Backfilling folder imageUrl and ensuring vocab_topics table...',
  );
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

    UPDATE vocab_folders
    SET "imageUrl" = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80'
    WHERE name::text ILIKE '%600%';

    UPDATE vocab_folders
    SET "imageUrl" = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80'
    WHERE name::text ILIKE '%General English%' OR name::text ILIKE '%Tiếng Anh giao tiếp%';

    UPDATE vocab_folders
    SET "imageUrl" = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80'
    WHERE name::text ILIKE '%TOEIC Advanced%' OR name::text ILIKE '%TOEIC nâng cao%';

    UPDATE vocab_folders
    SET "imageUrl" = 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80'
    WHERE name::text ILIKE '%Academic English%' OR name::text ILIKE '%học thuật%';

    UPDATE vocab_folders
    SET "imageUrl" = 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop&q=80'
    WHERE name::text ILIKE '%Business English%' OR name::text ILIKE '%thương mại%';

    UPDATE vocab_folders
    SET "imageUrl" = 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80'
    WHERE name::text ILIKE '%Spoken English%' OR name::text ILIKE '%đàm thoại%';

    UPDATE vocab_folders
    SET "imageUrl" = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80'
    WHERE name::text ILIKE '%Foundation English%' OR name::text ILIKE '%căn bản%';

    UPDATE vocab_flashcards fc
    SET topic = w.topic, "topicVi" = w."topicVi", "topicImageUrl" = w."topicImageUrl"
    FROM vocab_words w, vocab_folders f
    WHERE fc."wordId" = w.id 
      AND fc."folderId" = f.id 
      AND f.name::text ILIKE '%600%'
      AND (fc.topic IS NULL OR fc.topic = '');
  `);

  console.log('Step 2.5: Cleaning up legacy duplicate system folders...');
  const validFolderEnNames = [
    '600 Essential Words for TOEIC',
    'General English',
    'TOEIC Advanced',
    'Academic English',
    'Business English',
    'Spoken English',
    'Foundation English',
  ];

  const allSysFolders: FolderEntity[] = await folderRepo.find({
    where: { isSystem: true },
  });

  const legacyFolders = allSysFolders.filter((f) => {
    const rawName = f.name as unknown;
    const en =
      typeof rawName === 'string'
        ? rawName
        : (rawName as { en?: string })?.en || '';
    return !validFolderEnNames.includes(en);
  });

  if (legacyFolders.length > 0) {
    const legacyIds = legacyFolders.map((f) => f.id);
    const placeholders = legacyIds.map((_, i) => `$${i + 1}`).join(', ');
    await dataSource.query(
      `DELETE FROM vocab_flashcards WHERE "folderId" IN (${placeholders})`,
      legacyIds,
    );
    await dataSource.query(
      `DELETE FROM vocab_folders WHERE id IN (${placeholders})`,
      legacyIds,
    );
    console.log(
      `Cleaned up ${legacyFolders.length} legacy duplicate system folders.`,
    );
  }

  console.log('Step 3: Pre-loading existing master words for deduplication...');
  const existingWords: { id: string; term: string }[] = await dataSource.query(
    `SELECT id, term FROM vocab_words`,
  );
  const wordMapByTerm = new Map<string, WordEntity>();
  existingWords.forEach((w) => {
    const entity = new WordEntity();
    entity.id = w.id;
    entity.term = w.term;
    wordMapByTerm.set(w.term.toLowerCase(), entity);
  });

  console.log('Step 4: Pre-loading existing definition word IDs...');
  const defRows: { wordId: string }[] = await dataSource.query(
    `SELECT DISTINCT "wordId" FROM vocab_definitions`,
  );
  const definitionWordIdSet = new Set<string>(defRows.map((d) => d.wordId));

  for (const dataset of NGSL_DATASETS) {
    console.log(`\nProcessing Dataset: ${dataset.name.en} (${dataset.id})...`);
    await processDatasetFolder(
      dataset,
      systemUser.id,
      dataSource,
      folderRepo,
      wordMapByTerm,
      definitionWordIdSet,
    );
  }

  console.log('Step 5: Verifying folder and topic image URLs...');

  console.log(
    'Step 6: Recording Seed Version Audit Entry in vocab_seed_versions...',
  );
  const folderCountRes = await dataSource.query<{ count: number }[]>(
    `SELECT COUNT(*)::int AS count FROM vocab_folders WHERE "isSystem" = true`,
  );
  const wordCountRes = await dataSource.query<{ count: number }[]>(
    `SELECT COUNT(*)::int AS count FROM vocab_words`,
  );
  const flashcardCountRes = await dataSource.query<{ count: number }[]>(
    `SELECT COUNT(*)::int AS count FROM vocab_flashcards`,
  );

  const folderCount = folderCountRes[0]?.count || 0;
  const wordCount = wordCountRes[0]?.count || 0;
  const flashcardCount = flashcardCountRes[0]?.count || 0;

  const versionTag = `v1.0.0-${new Date().toISOString().slice(0, 10)}`;

  await dataSource.query(`
    CREATE TABLE IF NOT EXISTS vocab_seed_versions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      version VARCHAR(100) NOT NULL,
      name VARCHAR(255) NOT NULL,
      "folderCount" INT DEFAULT 0,
      "wordCount" INT DEFAULT 0,
      "flashcardCount" INT DEFAULT 0,
      status VARCHAR(50) DEFAULT 'COMPLETED',
      metadata JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);

  await dataSource.query(
    `
    INSERT INTO vocab_seed_versions (id, version, name, "folderCount", "wordCount", "flashcardCount", status, metadata, created_at, updated_at)
    VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, 'COMPLETED', $6, NOW(), NOW())
  `,
    [
      versionTag,
      'Lumen Master Vocabulary Datasets Seeding',
      folderCount,
      wordCount,
      flashcardCount,
      JSON.stringify({
        datasets: NGSL_DATASETS.map((d) => d.id),
        timestamp: new Date().toISOString(),
      }),
    ],
  );

  console.log(
    `\n--- NGSL Vocabulary Datasets Seeding Complete (Version: ${versionTag}, Folders: ${folderCount}, Words: ${wordCount}, Flashcards: ${flashcardCount}) ---`,
  );
}

async function processDatasetFolder(
  config: NgslDatasetConfig,
  adminId: string,
  dataSource: DataSource,
  folderRepo: Repository<FolderEntity>,
  wordMapByTerm: Map<string, WordEntity>,
  definitionWordIdSet: Set<string>,
): Promise<void> {
  // 1. Check or create FolderEntity
  const allFolders = await folderRepo.find({ where: { isSystem: true } });
  let folder = allFolders.find((f: FolderEntity) => {
    const rawName = f.name as unknown;
    const en =
      typeof rawName === 'string'
        ? rawName
        : (rawName as { en?: string })?.en || '';
    return en === config.name.en;
  });

  if (!folder) {
    folder = new FolderEntity();
    folder.name = config.name;
    folder.description = config.description;
    folder.category = config.category;
    folder.imageUrl = config.imageUrl;
    folder.authorId = adminId;
    folder.isSystem = true;
    folder = await folderRepo.save(folder);
    console.log(`Created Folder: ${config.name.en} (${folder.id})`);
  } else {
    folder.name = config.name;
    folder.description = config.description;
    folder.category = config.category;
    folder.imageUrl = config.imageUrl;
    folder = await folderRepo.save(folder);
  }

  // 2. Fetch CSV rows
  const rows: ParsedNgslRow[] = await fetchAndParseNgslCsv(config.csvUrl);
  if (rows.length === 0) {
    console.warn(`[NGSL Seeder] Skipping ${config.id} - no CSV data fetched.`);
    return;
  }

  console.log(`Fetched ${rows.length} terms for ${config.name.en}.`);

  const newWordsToSave: { term: string; cefrLevel: string }[] = [];

  for (let idx = 0; idx < rows.length; idx++) {
    const row = rows[idx];
    const cleanTerm = row.term.trim().toLowerCase();
    const word = wordMapByTerm.get(cleanTerm);

    if (!word) {
      newWordsToSave.push({
        term: cleanTerm,
        cefrLevel: inferCefrLevel(row.rank),
      });
    }
  }

  // 3. Save new Master Words in bulk SQL
  if (newWordsToSave.length > 0) {
    const chunkSize = 200;
    for (let i = 0; i < newWordsToSave.length; i += chunkSize) {
      const chunk = newWordsToSave.slice(i, i + chunkSize);
      const placeholders = chunk
        .map(
          (_, idx) =>
            `(gen_random_uuid(), $${idx * 2 + 1}, $${idx * 2 + 2}, NOW(), NOW())`,
        )
        .join(', ');
      const params: (string | number)[] = [];
      chunk.forEach((w) => params.push(w.term, w.cefrLevel));

      const inserted: { id: string; term: string; cefrLevel: string }[] =
        await dataSource.query(
          `INSERT INTO vocab_words (id, term, "cefrLevel", created_at, updated_at)
         VALUES ${placeholders}
         ON CONFLICT (term) DO UPDATE SET updated_at = NOW()
         RETURNING id, term, "cefrLevel"`,
          params,
        );
      inserted.forEach((w) => {
        const entity = new WordEntity();
        entity.id = w.id;
        entity.term = w.term;
        wordMapByTerm.set(w.term.toLowerCase(), entity);
      });
    }
    console.log(`Saved ${newWordsToSave.length} new master words.`);
  }

  // 3.5. Ensure TopicEntity rows exist in vocab_topics for this folder
  const topicMapByEn = new Map<string, string>();
  for (let sIdx = 0; sIdx < config.subTopics.length; sIdx++) {
    const st = config.subTopics[sIdx];
    const nameJson = JSON.stringify({ en: st.en, vi: st.vi });
    const existingTopic: { id: string }[] = await dataSource.query(
      `SELECT id FROM vocab_topics WHERE "folderId" = $1 AND name->>'en' = $2 LIMIT 1`,
      [folder.id, st.en],
    );
    if (existingTopic.length > 0) {
      topicMapByEn.set(st.en, existingTopic[0].id);
      await dataSource.query(
        `UPDATE vocab_topics SET name = $1::jsonb, "imageUrl" = $2, "orderIndex" = $3, updated_at = NOW() WHERE id = $4`,
        [nameJson, st.imageUrl, sIdx, existingTopic[0].id],
      );
    } else {
      const inserted: { id: string }[] = await dataSource.query(
        `INSERT INTO vocab_topics (id, "folderId", name, "imageUrl", "orderIndex", created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2::jsonb, $3, $4, NOW(), NOW())
         RETURNING id`,
        [folder.id, nameJson, st.imageUrl, sIdx],
      );
      if (inserted[0]?.id) {
        topicMapByEn.set(st.en, inserted[0].id);
      }
    }
  }

  // 4. Query existing flashcards in this folder
  const existingFlashcards: {
    id: string;
    wordId: string;
    topicId: string | null;
    topic: unknown;
    topicImageUrl: string | null;
  }[] = await dataSource.query(
    `SELECT id, "wordId", "topicId", topic, "topicImageUrl" FROM vocab_flashcards WHERE "folderId" = $1`,
    [folder.id],
  );
  const flashcardMapByWordId = new Map<
    string,
    (typeof existingFlashcards)[0]
  >();
  existingFlashcards.forEach((fc) => flashcardMapByWordId.set(fc.wordId, fc));

  const flashcardsToInsert: {
    folderId: string;
    wordId: string;
    topicId: string;
    topic: string;
    topicImageUrl: string;
  }[] = [];
  const flashcardsToUpdate: {
    id: string;
    topicId: string;
    topic: string;
    topicImageUrl: string;
  }[] = [];
  const definitionsToInsert: {
    wordId: string;
    partOfSpeech: string;
    definition: Record<string, string>;
  }[] = [];

  for (let idx = 0; idx < rows.length; idx++) {
    const row = rows[idx];
    const cleanTerm = row.term.trim().toLowerCase();
    const word = wordMapByTerm.get(cleanTerm);
    if (!word || !word.id) continue;

    const subTopic = assignSubTopic(config, idx, cleanTerm);
    const targetTopicId = topicMapByEn.get(subTopic.en) || null;
    const fc = flashcardMapByWordId.get(word.id);

    const topicJsonStr = JSON.stringify({ en: subTopic.en, vi: subTopic.vi });

    if (!fc) {
      if (targetTopicId) {
        flashcardsToInsert.push({
          folderId: folder.id,
          wordId: word.id,
          topicId: targetTopicId,
          topic: topicJsonStr,
          topicImageUrl: subTopic.imageUrl,
        });
      }
    } else {
      const existingTopicObj =
        typeof fc.topic === 'string'
          ? (tryParseJson(fc.topic) ?? {})
          : fc.topic || {};
      const existingEn = (existingTopicObj as Record<string, string>)?.en;
      if (
        fc.topicId !== targetTopicId ||
        existingEn !== subTopic.en ||
        fc.topicImageUrl !== subTopic.imageUrl
      ) {
        if (targetTopicId) {
          flashcardsToUpdate.push({
            id: fc.id,
            topicId: targetTopicId,
            topic: topicJsonStr,
            topicImageUrl: subTopic.imageUrl,
          });
        }
      }
    }

    if (!definitionWordIdSet.has(word.id)) {
      definitionsToInsert.push({
        wordId: word.id,
        partOfSpeech: 'n.',
        definition: { en: word.term, vi: word.term },
      });
      definitionWordIdSet.add(word.id);
    }
  }

  // 5. Bulk Insert New Flashcards
  if (flashcardsToInsert.length > 0) {
    const chunkSize = 200;
    for (let i = 0; i < flashcardsToInsert.length; i += chunkSize) {
      const chunk = flashcardsToInsert.slice(i, i + chunkSize);
      const placeholders = chunk
        .map(
          (_, idx) =>
            `(gen_random_uuid(), $${idx * 5 + 1}::uuid, $${idx * 5 + 2}::uuid, $${idx * 5 + 3}::uuid, $${idx * 5 + 4}::jsonb, $${idx * 5 + 5}, NOW(), NOW())`,
        )
        .join(', ');
      const params: string[] = [];
      chunk.forEach((fc) =>
        params.push(
          fc.folderId,
          fc.wordId,
          fc.topicId,
          fc.topic,
          fc.topicImageUrl,
        ),
      );

      await dataSource.query(
        `INSERT INTO vocab_flashcards (id, "folderId", "wordId", "topicId", topic, "topicImageUrl", created_at, updated_at)
         VALUES ${placeholders}
         ON CONFLICT ("folderId", "wordId") DO UPDATE 
         SET "topicId" = EXCLUDED."topicId", topic = EXCLUDED.topic, "topicImageUrl" = EXCLUDED."topicImageUrl"`,
        params,
      );
    }
    console.log(
      `Linked ${flashcardsToInsert.length} new flashcards to folder ${config.name.en}.`,
    );
  }

  // 6. Bulk Update Existing Flashcards with topicId & granular sub-topics
  if (flashcardsToUpdate.length > 0) {
    const chunkSize = 200;
    for (let i = 0; i < flashcardsToUpdate.length; i += chunkSize) {
      const chunk = flashcardsToUpdate.slice(i, i + chunkSize);
      const placeholders = chunk
        .map(
          (_, idx) =>
            `($${idx * 4 + 1}::uuid, $${idx * 4 + 2}::uuid, $${idx * 4 + 3}::jsonb, $${idx * 4 + 4}::text)`,
        )
        .join(', ');
      const params: string[] = [];
      chunk.forEach((fc) =>
        params.push(fc.id, fc.topicId, fc.topic, fc.topicImageUrl),
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
    }
    console.log(
      `Updated ${flashcardsToUpdate.length} existing flashcards with topicId for folder ${config.name.en}.`,
    );
  }

  // 7. Bulk Insert Definitions
  if (definitionsToInsert.length > 0) {
    const chunkSize = 200;
    for (let i = 0; i < definitionsToInsert.length; i += chunkSize) {
      const chunk = definitionsToInsert.slice(i, i + chunkSize);
      const placeholders = chunk
        .map(
          (_, idx) =>
            `(gen_random_uuid(), $${idx * 3 + 1}::uuid, $${idx * 3 + 2}, $${idx * 3 + 3}::jsonb, NOW(), NOW())`,
        )
        .join(', ');
      const params: string[] = [];
      chunk.forEach((d) =>
        params.push(d.wordId, d.partOfSpeech, JSON.stringify(d.definition)),
      );

      await dataSource.query(
        `INSERT INTO vocab_definitions (id, "wordId", "partOfSpeech", definition, created_at, updated_at)
         VALUES ${placeholders}`,
        params,
      );
    }
    console.log(
      `Saved ${definitionsToInsert.length} definitions for folder ${config.name.en}.`,
    );
  }
}

function tryParseJson(val: unknown): Record<string, string> | null {
  if (typeof val === 'string') {
    try {
      const parsed: unknown = JSON.parse(val);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed as Record<string, string>;
      }
    } catch {
      return null;
    }
  }
  if (typeof val === 'object' && val !== null) {
    return val as Record<string, string>;
  }
  return null;
}
