import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import { AuthProvider } from './contexts/iam/domain/enums/auth-provider.enum';
import { Role } from './contexts/iam/domain/enums/role.enum';
import { UserEntity } from './contexts/iam/infrastructure/entities/user.entity';
import { FolderEntity } from './contexts/vocabulary/infrastructure/entities/folder.entity';
import { DefinitionEntity } from './contexts/vocabulary/infrastructure/entities/definition.entity';
import { ExampleEntity } from './contexts/vocabulary/infrastructure/entities/example.entity';
import { FlashcardEntity } from './contexts/vocabulary/infrastructure/entities/flashcard.entity';
import { WordEntity } from './contexts/vocabulary/infrastructure/entities/word.entity';
import { fetchDictionaryPronunciations } from './contexts/vocabulary/infrastructure/helpers/dictionary-audio.helper';

interface ToeicRecord {
  english: string;
  type: string;
  vietnamese: string;
  pronounce: string;
  explain: string;
  example: string;
  example_vietnamese: string;
  image_url: string;
  audio_url: string;
  topic: string;
  topic_url: string;
}

function parseCSV(text: string): ToeicRecord[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const header = lines[0].split(',').map((h) => h.trim());
  const rows: ToeicRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const row: string[] = [];
    let insideQuote = false;
    let field = '';

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        row.push(field.trim());
        field = '';
      } else {
        field += char;
      }
    }
    row.push(field.trim());

    if (row.length >= header.length) {
      const obj: Record<string, string> = {};
      header.forEach((h, idx) => {
        let val = row[idx] || '';
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.slice(1, -1).trim();
        }
        obj[h] = val;
      });
      rows.push(obj as unknown as ToeicRecord);
    }
  }
  return rows;
}

export async function seedToeicVocabulary(
  dataSource: DataSource,
): Promise<void> {
  const userRepo = dataSource.getRepository(UserEntity);
  const folderRepo = dataSource.getRepository(FolderEntity);
  const wordRepo = dataSource.getRepository(WordEntity);
  const definitionRepo = dataSource.getRepository(DefinitionEntity);
  const exampleRepo = dataSource.getRepository(ExampleEntity);
  const flashcardRepo = dataSource.getRepository(FlashcardEntity);

  console.log('--- Bulk Seeding 600 TOEIC Vocabulary Dataset ---');

  // 1. Ensure System Admin User exists
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

  // 2. Read Dataset CSV
  const datasetPath = path.join(
    process.cwd(),
    '../toeic-600-words-dataset/data/toeic_600_words.csv',
  );

  if (!fs.existsSync(datasetPath)) {
    console.warn(`Dataset file not found at: ${datasetPath}`);
    return;
  }

  const csvContent = fs.readFileSync(datasetPath, 'utf8');
  const records = parseCSV(csvContent);
  console.log(`Loaded ${records.length} records from CSV dataset.`);

  // Group records by topic (Folder)
  const topicMap: Record<string, ToeicRecord[]> = {};
  records.forEach((r) => {
    const topic = r.topic?.trim() || 'General TOEIC';
    if (!topicMap[topic]) topicMap[topic] = [];
    topicMap[topic].push(r);
  });

  const topics = Object.keys(topicMap);
  console.log(`Found ${topics.length} TOEIC Folders.`);

  // Bulk Load Existing Data
  const existingFolders = await folderRepo.find();
  const existingWords = await wordRepo.find();

  const folderMapByName = new Map<string, FolderEntity>();
  existingFolders.forEach((d) => folderMapByName.set(d.name, d));

  const wordMapByTerm = new Map<string, WordEntity>();
  existingWords.forEach((w) => wordMapByTerm.set(w.term, w));

  // 1. Bulk Create Folders
  const newFoldersToSave: FolderEntity[] = [];
  for (const topicName of topics) {
    if (!folderMapByName.has(topicName)) {
      const d = new FolderEntity();
      d.name = topicName;
      d.description = `600 Essential Words for TOEIC: ${topicName}`;
      d.authorId = systemUser.id;
      d.category = 'TOEIC';
      newFoldersToSave.push(d);
    }
  }

  if (newFoldersToSave.length > 0) {
    const saved = await folderRepo.save(newFoldersToSave, { chunk: 100 });
    saved.forEach((d) => folderMapByName.set(d.name, d));
    console.log(`Bulk saved ${saved.length} Folders.`);
  }

  // 2. Bulk Create & Update Words
  const newWordsToSave: WordEntity[] = [];
  const wordsToUpdate: WordEntity[] = [];
  const wordRecordPairs: { word: WordEntity; record: ToeicRecord }[] = [];

  for (const topicName of topics) {
    for (const item of topicMap[topicName]) {
      const term = item.english.trim();
      if (!term) continue;

      const existingWord = wordMapByTerm.get(term);
      if (!existingWord) {
        const w = new WordEntity();
        w.term = term;
        w.phonetic = item.pronounce || null;
        w.phoneticUs = item.pronounce || null;
        w.audioUrl = item.audio_url || null;
        w.audioUsUrl = item.audio_url || null;
        w.cefrLevel = 'B1';
        w.imageUrl = item.image_url || null;
        newWordsToSave.push(w);
        wordRecordPairs.push({ word: w, record: item });
        wordMapByTerm.set(term, w); // temporary map
      } else {
        let updated = false;
        if (!existingWord.imageUrl && item.image_url) {
          existingWord.imageUrl = item.image_url;
          updated = true;
        }
        if (!existingWord.audioUsUrl && item.audio_url) {
          existingWord.audioUsUrl = item.audio_url;
          updated = true;
        }
        if (!existingWord.phoneticUs && item.pronounce) {
          existingWord.phoneticUs = item.pronounce;
          updated = true;
        }
        if (updated) {
          wordsToUpdate.push(existingWord);
        }
      }
    }
  }

  if (newWordsToSave.length > 0) {
    const savedWords = await wordRepo.save(newWordsToSave, { chunk: 100 });
    savedWords.forEach((w) => wordMapByTerm.set(w.term, w));
    console.log(`Bulk saved ${savedWords.length} Words.`);
  }

  if (wordsToUpdate.length > 0) {
    await wordRepo.save(wordsToUpdate, { chunk: 100 });
    console.log(
      `Updated audio/imageUrl for ${wordsToUpdate.length} existing Words.`,
    );
  }

  // 2.1 Enrich UK audio for words via Dictionary API in batches
  const wordsNeedingUk = await wordRepo
    .createQueryBuilder('w')
    .where('w.audioUkUrl IS NULL')
    .take(60)
    .getMany();

  if (wordsNeedingUk.length > 0) {
    const ukWordsToSave: WordEntity[] = [];
    for (const word of wordsNeedingUk) {
      try {
        const enriched = await fetchDictionaryPronunciations(word.term);
        let updated = false;
        if (enriched.audioUkUrl) {
          word.audioUkUrl = enriched.audioUkUrl;
          updated = true;
        }
        if (enriched.phoneticUk) {
          word.phoneticUk = enriched.phoneticUk;
          updated = true;
        }
        if (updated) {
          ukWordsToSave.push(word);
        }
      } catch {
        // ignore dictionary lookup error
      }
    }
    if (ukWordsToSave.length > 0) {
      await wordRepo.save(ukWordsToSave);
      console.log(`Enriched UK audio for ${ukWordsToSave.length} Words.`);
    }
  }

  // 3. Bulk Create Definitions & Examples
  const definitionsToSave: DefinitionEntity[] = [];
  const examplesToSave: ExampleEntity[] = [];
  const flashcardsToSave: FlashcardEntity[] = [];

  const existingFlashcards = await flashcardRepo.find();
  const flashcardSet = new Set<string>();
  existingFlashcards.forEach((f) =>
    flashcardSet.add(`${f.folderId}_${f.wordId}`),
  );

  const existingDefs = await definitionRepo.find();
  const defWordSet = new Set<string>();
  existingDefs.forEach((df) => defWordSet.add(df.wordId));

  for (const topicName of topics) {
    const folder = folderMapByName.get(topicName);
    if (!folder) continue;

    for (const item of topicMap[topicName]) {
      const term = item.english.trim();
      const word = wordMapByTerm.get(term);
      if (!word) continue;

      // Check Flashcard
      const key = `${folder.id}_${word.id}`;
      if (!flashcardSet.has(key)) {
        const fc = new FlashcardEntity();
        fc.folderId = folder.id;
        fc.wordId = word.id;
        flashcardsToSave.push(fc);
        flashcardSet.add(key);
      }

      // Check Definition
      if (!defWordSet.has(word.id)) {
        const def = new DefinitionEntity();
        def.wordId = word.id;
        def.partOfSpeech = item.type || 'v.';
        def.definition = {
          en: item.explain || term,
          vi: item.vietnamese || '',
        };
        definitionsToSave.push(def);
        defWordSet.add(word.id);

        if (item.example) {
          const ex = new ExampleEntity();
          ex.definition = def; // TypeORM CASCADE/linking
          ex.sentence = {
            en: item.example,
            vi: item.example_vietnamese || '',
          };
          examplesToSave.push(ex);
        }
      }
    }
  }

  if (definitionsToSave.length > 0) {
    const savedDefs = await definitionRepo.save(definitionsToSave, {
      chunk: 100,
    });
    console.log(`Bulk saved ${savedDefs.length} Definitions.`);
  }

  if (examplesToSave.length > 0) {
    const savedExamples = await exampleRepo.save(examplesToSave, {
      chunk: 100,
    });
    console.log(`Bulk saved ${savedExamples.length} Examples.`);
  }

  if (flashcardsToSave.length > 0) {
    const savedFc = await flashcardRepo.save(flashcardsToSave, { chunk: 100 });
    console.log(`Bulk saved ${savedFc.length} Flashcards.`);
  }

  console.log('--- 600 TOEIC Vocabulary Seeding Complete ---');
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    await seedToeicVocabulary(dataSource);
  } catch (error) {
    console.error('TOEIC Seeding Error:', error);
  } finally {
    await app.close();
  }
}

if (require.main === module) {
  void bootstrap();
}
