import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import { AuthProvider } from './contexts/iam/domain/enums/auth-provider.enum';
import { Role } from './contexts/iam/domain/enums/role.enum';
import { UserEntity } from './contexts/iam/infrastructure/entities/user.entity';
import { DefinitionEntity } from './contexts/vocabulary/infrastructure/entities/definition.entity';
import { ExampleEntity } from './contexts/vocabulary/infrastructure/entities/example.entity';
import { FlashcardEntity } from './contexts/vocabulary/infrastructure/entities/flashcard.entity';
import { FolderEntity } from './contexts/vocabulary/infrastructure/entities/folder.entity';
import { WordEntity } from './contexts/vocabulary/infrastructure/entities/word.entity';
import { fetchDictionaryPronunciations } from './contexts/vocabulary/infrastructure/helpers/dictionary-audio.helper';

const TOPICS_METADATA: Record<string, { vi: string; image: string }> = {
  Contracts: {
    vi: 'Hợp Đồng',
    image:
      'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=200&h=200&fit=crop&q=80',
  },
  Marketing: {
    vi: 'Thị Trường',
    image:
      'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=200&h=200&fit=crop&q=80',
  },
  Warranties: {
    vi: 'Sự Bảo Hành',
    image:
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&h=200&fit=crop&q=80',
  },
  'Business Planning': {
    vi: 'Kế Hoạch Kinh Doanh',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&h=200&fit=crop&q=80',
  },
  Conference: {
    vi: 'Hội Nghị',
    image:
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=200&h=200&fit=crop&q=80',
  },
  'Computers and the Internet': {
    vi: 'Máy Vi Tính',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&h=200&fit=crop&q=80',
  },
  'Office Technology': {
    vi: 'Công Nghệ Cho Công Sở',
    image:
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=200&h=200&fit=crop&q=80',
  },
  'Office Procedures': {
    vi: 'Các Quy Trình Trong Công Sở',
    image:
      'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=200&h=200&fit=crop&q=80',
  },
  Electronics: {
    vi: 'Điện Tử',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop&q=80',
  },
  Correspondence: {
    vi: 'Thư Tín',
    image:
      'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=200&h=200&fit=crop&q=80',
  },
  'Job Ads & Recruitment': {
    vi: 'Quảng Cáo Việc Làm & Tuyển Dụng',
    image:
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=200&h=200&fit=crop&q=80',
  },
  'Apply and Interviewing': {
    vi: 'Ứng Tuyển và Phỏng Vấn',
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&q=80',
  },
  'Hiring and Training': {
    vi: 'Tuyển Dụng và Đào Tạo',
    image:
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=200&h=200&fit=crop&q=80',
  },
  'Salaries & Benefits': {
    vi: 'Lương và Các Chế Độ Đãi Ngộ',
    image:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=200&fit=crop&q=80',
  },
  'Promotions, Pensions & Award': {
    vi: 'Thăng Chức, Lương Hưu và Thưởng',
    image:
      'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=200&h=200&fit=crop&q=80',
  },
  Shopping: {
    vi: 'Mua Sắm',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&h=200&fit=crop&q=80',
  },
  'Ordering Supplies': {
    vi: 'Đặt Hàng Nhà Cung Cấp',
    image:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&h=200&fit=crop&q=80',
  },
  Shipping: {
    vi: 'Vận Chuyển Hàng Hóa',
    image:
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=200&h=200&fit=crop&q=80',
  },
  Invoice: {
    vi: 'Hóa Đơn',
    image:
      'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=200&h=200&fit=crop&q=80',
  },
  Inventory: {
    vi: 'Kiểm Kê Hàng Hóa',
    image:
      'https://images.unsplash.com/photo-1553413077-190dd305871c?w=200&h=200&fit=crop&q=80',
  },
  Banking: {
    vi: 'Ngân Hàng',
    image:
      'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=200&h=200&fit=crop&q=80',
  },
  Accounting: {
    vi: 'Kế Toán',
    image:
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=200&h=200&fit=crop&q=80',
  },
  Investment: {
    vi: 'Đầu Tư',
    image:
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&h=200&fit=crop&q=80',
  },
  Taxes: {
    vi: 'Thuế',
    image:
      'https://images.unsplash.com/photo-1554224154-22dec7ec8818?w=200&h=200&fit=crop&q=80',
  },
  'Financial Statements': {
    vi: 'Báo Cáo Tài Chính',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=200&fit=crop&q=80',
  },
  'Property & Departments': {
    vi: 'Bất Động Sản & Các Phòng Ban',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=200&fit=crop&q=80',
  },
  'Board Meeting & Committees': {
    vi: 'Họp Hội Đồng & Ủy Ban',
    image:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200&h=200&fit=crop&q=80',
  },
  'Quality Control': {
    vi: 'Kiểm Soát Chất Lượng',
    image:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop&q=80',
  },
  'Product Development': {
    vi: 'Phát Triển Sản Phẩm',
    image:
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=200&h=200&fit=crop&q=80',
  },
  'Renting and Leasing': {
    vi: 'Thuê và Cho Thuê',
    image:
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=200&fit=crop&q=80',
  },
  'Selecting A Restaurant': {
    vi: 'Chọn Nhà Hàng',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop&q=80',
  },
  'Eating Out': {
    vi: 'Ăn Ngoài',
    image:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop&q=80',
  },
  'Ordering Lunch': {
    vi: 'Đặt Cơm Trưa',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop&q=80',
  },
  'Cooking As A Career': {
    vi: 'Nghề Đầu Bếp',
    image:
      'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&h=200&fit=crop&q=80',
  },
  Events: {
    vi: 'Sự Kiện',
    image:
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=200&h=200&fit=crop&q=80',
  },
  'General Travel': {
    vi: 'Du Lịch Tổng Hợp',
    image:
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&h=200&fit=crop&q=80',
  },
  Airlines: {
    vi: 'Hãng Hàng Không',
    image:
      'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200&h=200&fit=crop&q=80',
  },
  Trains: {
    vi: 'Tàu Hỏa',
    image:
      'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=200&h=200&fit=crop&q=80',
  },
  Hotels: {
    vi: 'Khách Sạn',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop&q=80',
  },
  'Car Rentals': {
    vi: 'Thuê Xe Hơi',
    image:
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=200&h=200&fit=crop&q=80',
  },
  Movies: {
    vi: 'Rạp Chiếu Phim',
    image:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&h=200&fit=crop&q=80',
  },
  Theater: {
    vi: 'Nhà Hát',
    image:
      'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=200&h=200&fit=crop&q=80',
  },
  Music: {
    vi: 'Âm Nhạc',
    image:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop&q=80',
  },
  Museums: {
    vi: 'Bảo Tàng',
    image:
      'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=200&h=200&fit=crop&q=80',
  },
  Media: {
    vi: 'Truyền Thông',
    image:
      'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=200&h=200&fit=crop&q=80',
  },
  "Doctor's Office": {
    vi: 'Phòng Khám Bác Sĩ',
    image:
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&q=80',
  },
  "Dentist's Office": {
    vi: 'Phòng Khám Nha Sĩ',
    image:
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=200&h=200&fit=crop&q=80',
  },
  Health: {
    vi: 'Sức Khỏe',
    image:
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=200&h=200&fit=crop&q=80',
  },
  Hospitals: {
    vi: 'Bệnh Viện',
    image:
      'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=200&h=200&fit=crop&q=80',
  },
  Pharmacy: {
    vi: 'Hiệu Thuốc',
    image:
      'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=200&h=200&fit=crop&q=80',
  },
};

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
  existingFolders.forEach((d) => {
    const enName = typeof d.name === 'string' ? d.name : d.name?.en || '';
    if (enName) folderMapByName.set(enName, d);
  });

  const wordMapByTerm = new Map<string, WordEntity>();
  existingWords.forEach((w) => wordMapByTerm.set(w.term, w));

  // 1. Bulk Create Folders
  const newFoldersToSave: FolderEntity[] = [];
  for (const topicName of topics) {
    if (!folderMapByName.has(topicName)) {
      const d = new FolderEntity();
      const topicVi = TOPICS_METADATA[topicName]?.vi || topicName;
      d.name = {
        en: topicName,
        vi: topicVi,
      };
      d.description = {
        en: `600 Essential Words for TOEIC: ${topicName}`,
        vi: `600 từ vựng TOEIC thiết yếu: ${topicVi}`,
      };
      d.authorId = systemUser.id;
      d.category = {
        en: 'TOEIC Vocabulary',
        vi: 'Từ vựng TOEIC',
      };
      d.isSystem = true;
      newFoldersToSave.push(d);
    }
  }

  if (newFoldersToSave.length > 0) {
    const saved = await folderRepo.save(newFoldersToSave, { chunk: 100 });
    saved.forEach((d) => {
      const enName = typeof d.name === 'string' ? d.name : d.name?.en || '';
      if (enName) folderMapByName.set(enName, d);
    });
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
        w.topic = topicName;
        w.topicVi = TOPICS_METADATA[topicName]?.vi || topicName;
        w.topicImageUrl = TOPICS_METADATA[topicName]?.image || null;
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
