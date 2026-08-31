import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import { UserEntity } from './contexts/iam/infrastructure/entities/user.entity';
import { DeckEntity } from './contexts/vocabulary/infrastructure/entities/deck.entity';
import { WordEntity } from './contexts/vocabulary/infrastructure/entities/word.entity';
import { DefinitionEntity } from './contexts/vocabulary/infrastructure/entities/definition.entity';
import { ExampleEntity } from './contexts/vocabulary/infrastructure/entities/example.entity';
import { FlashcardEntity } from './contexts/vocabulary/infrastructure/entities/flashcard.entity';
import { Role } from './contexts/iam/domain/enums/role.enum';
import { AuthProvider } from './contexts/iam/domain/enums/auth-provider.enum';

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
      const obj: any = {};
      header.forEach((h, idx) => {
        let val = row[idx] || '';
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.slice(1, -1).trim();
        }
        obj[h] = val;
      });
      rows.push(obj as ToeicRecord);
    }
  }
  return rows;
}

export async function seedToeicVocabulary(dataSource: DataSource): Promise<void> {
  const userRepo = dataSource.getRepository(UserEntity);
  const deckRepo = dataSource.getRepository(DeckEntity);
  const wordRepo = dataSource.getRepository(WordEntity);
  const definitionRepo = dataSource.getRepository(DefinitionEntity);
  const exampleRepo = dataSource.getRepository(ExampleEntity);
  const flashcardRepo = dataSource.getRepository(FlashcardEntity);

  console.log('--- Bulk Seeding 600 TOEIC Vocabulary Dataset ---');

  // 1. Ensure System Admin User exists
  let systemUser = await userRepo.findOne({ where: { email: 'system@lumen.com' } });
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

  // Group records by topic (Deck)
  const topicMap: Record<string, ToeicRecord[]> = {};
  records.forEach((r) => {
    const topic = r.topic?.trim() || 'General TOEIC';
    if (!topicMap[topic]) topicMap[topic] = [];
    topicMap[topic].push(r);
  });

  const topics = Object.keys(topicMap);
  console.log(`Found ${topics.length} TOEIC Topics (Decks).`);

  // Bulk Load Existing Data
  const existingDecks = await deckRepo.find();
  const existingWords = await wordRepo.find();

  const deckMapByName = new Map<string, DeckEntity>();
  existingDecks.forEach((d) => deckMapByName.set(d.name, d));

  const wordMapByTerm = new Map<string, WordEntity>();
  existingWords.forEach((w) => wordMapByTerm.set(w.term, w));

  // 1. Bulk Create Decks
  const newDecksToSave: DeckEntity[] = [];
  for (const topicName of topics) {
    if (!deckMapByName.has(topicName)) {
      const d = new DeckEntity();
      d.name = topicName;
      d.description = `600 Essential Words for TOEIC: ${topicName}`;
      d.authorId = systemUser.id;
      d.category = 'TOEIC';
      newDecksToSave.push(d);
    }
  }

  if (newDecksToSave.length > 0) {
    const saved = await deckRepo.save(newDecksToSave, { chunk: 100 });
    saved.forEach((d) => deckMapByName.set(d.name, d));
    console.log(`Bulk saved ${saved.length} Decks.`);
  }

  // 2. Bulk Create Words
  const newWordsToSave: WordEntity[] = [];
  const wordRecordPairs: { word: WordEntity; record: ToeicRecord }[] = [];

  for (const topicName of topics) {
    for (const item of topicMap[topicName]) {
      const term = item.english.trim();
      if (!term) continue;

      if (!wordMapByTerm.has(term)) {
        const w = new WordEntity();
        w.term = term;
        w.phonetic = item.pronounce || null;
        w.audioUrl = item.audio_url || null;
        w.cefrLevel = 'B1';
        newWordsToSave.push(w);
        wordRecordPairs.push({ word: w, record: item });
        wordMapByTerm.set(term, w); // temporary map
      }
    }
  }

  if (newWordsToSave.length > 0) {
    const savedWords = await wordRepo.save(newWordsToSave, { chunk: 100 });
    savedWords.forEach((w) => wordMapByTerm.set(w.term, w));
    console.log(`Bulk saved ${savedWords.length} Words.`);
  }

  // 3. Bulk Create Definitions & Examples
  const definitionsToSave: DefinitionEntity[] = [];
  const examplesToSave: ExampleEntity[] = [];
  const flashcardsToSave: FlashcardEntity[] = [];

  const existingFlashcards = await flashcardRepo.find();
  const flashcardSet = new Set<string>();
  existingFlashcards.forEach((f) => flashcardSet.add(`${f.deckId}_${f.wordId}`));

  const existingDefs = await definitionRepo.find();
  const defWordSet = new Set<string>();
  existingDefs.forEach((df) => defWordSet.add(df.wordId));

  for (const topicName of topics) {
    const deck = deckMapByName.get(topicName);
    if (!deck) continue;

    for (const item of topicMap[topicName]) {
      const term = item.english.trim();
      const word = wordMapByTerm.get(term);
      if (!word) continue;

      // Check Flashcard
      const key = `${deck.id}_${word.id}`;
      if (!flashcardSet.has(key)) {
        const fc = new FlashcardEntity();
        fc.deckId = deck.id;
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
    const savedDefs = await definitionRepo.save(definitionsToSave, { chunk: 100 });
    console.log(`Bulk saved ${savedDefs.length} Definitions.`);
  }

  if (examplesToSave.length > 0) {
    const savedExamples = await exampleRepo.save(examplesToSave, { chunk: 100 });
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
  bootstrap();
}
