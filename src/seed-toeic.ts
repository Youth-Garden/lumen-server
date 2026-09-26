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
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353856/lumen/vocabulary/topics/photo_1450133064473-71024230f91b.webp',
  },
  Marketing: {
    vi: 'Thị Trường',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353849/lumen/vocabulary/topics/photo_1533750516457-a7f992034fec.webp',
  },
  Warranties: {
    vi: 'Sự Bảo Hành',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353863/lumen/vocabulary/topics/photo_1589829545856-d10d557cf95f.webp',
  },
  'Business Planning': {
    vi: 'Kế Hoạch Kinh Doanh',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353845/lumen/vocabulary/topics/photo_1454165804606-c3d57bc86b40.webp',
  },
  Conference: {
    vi: 'Hội Nghị',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353861/lumen/vocabulary/topics/photo_1511578314322-379afb476865.webp',
  },
  'Computers and the Internet': {
    vi: 'Máy Vi Tính',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353870/lumen/vocabulary/topics/photo_1498050108023-c5249f4df085.webp',
  },
  'Office Technology': {
    vi: 'Công Nghệ Cho Công Sở',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353857/lumen/vocabulary/topics/photo_1497215728101-856f4ea42174.webp',
  },
  'Office Procedures': {
    vi: 'Các Quy Trình Trong Công Sở',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353847/lumen/vocabulary/topics/photo_1484480974693-6ca0a78fb36b.webp',
  },
  Electronics: {
    vi: 'Điện Tử',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353851/lumen/vocabulary/topics/photo_1518770660439-4636190af475.jpg',
  },
  Correspondence: {
    vi: 'Thư Tín',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353849/lumen/vocabulary/topics/photo_1557200134-90327ee9fafa.webp',
  },
  'Job Ads & Recruitment': {
    vi: 'Quảng Cáo Việc Làm & Tuyển Dụng',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353849/lumen/vocabulary/topics/photo_1586281380349-632531db7ed4.webp',
  },
  'Apply and Interviewing': {
    vi: 'Ứng Tuyển và Phỏng Vấn',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353850/lumen/vocabulary/topics/photo_1573496359142-b8d87734a5a2.webp',
  },
  'Hiring and Training': {
    vi: 'Tuyển Dụng và Đào Tạo',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353850/lumen/vocabulary/topics/photo_1524178232363-1fb2b075b655.webp',
  },
  'Salaries & Benefits': {
    vi: 'Lương và Các Chế Độ Đãi Ngộ',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353859/lumen/vocabulary/topics/photo_1554224155-6726b3ff858f.webp',
  },
  'Promotions, Pensions & Award': {
    vi: 'Thăng Chức, Lương Hưu và Thưởng',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353871/lumen/vocabulary/topics/photo_1567427017947-545c5f8d16ad.webp',
  },
  Shopping: {
    vi: 'Mua Sắm',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353869/lumen/vocabulary/topics/photo_1483985988355-763728e1935b.webp',
  },
  'Ordering Supplies': {
    vi: 'Đặt Hàng Nhà Cung Cấp',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353869/lumen/vocabulary/topics/photo_1586528116311-ad8dd3c8310d.jpg',
  },
  Shipping: {
    vi: 'Vận Chuyển Hàng Hóa',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353851/lumen/vocabulary/topics/photo_1578575437130-527eed3abbec.webp',
  },
  Invoice: {
    vi: 'Hóa Đơn',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353857/lumen/vocabulary/topics/photo_1554224154-26032ffc0d07.webp',
  },
  Inventory: {
    vi: 'Kiểm Kê Hàng Hóa',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353847/lumen/vocabulary/topics/photo_1553413077-190dd305871c.jpg',
  },
  Banking: {
    vi: 'Ngân Hàng',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353863/lumen/vocabulary/topics/photo_1501167786227-4cba60f6d58f.webp',
  },
  Accounting: {
    vi: 'Kế Toán',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353856/lumen/vocabulary/topics/photo_1554224155-8d04cb21cd6c.webp',
  },
  Investment: {
    vi: 'Đầu Tư',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353869/lumen/vocabulary/topics/photo_1611974789855-9c2a0a7236a3.webp',
  },
  Taxes: {
    vi: 'Thuế',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353872/lumen/vocabulary/topics/photo_1554224154-22dec7ec8818.webp',
  },
  'Financial Statements': {
    vi: 'Báo Cáo Tài Chính',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353862/lumen/vocabulary/topics/photo_1460925895917-afdab827c52f.webp',
  },
  'Property & Departments': {
    vi: 'Bất Động Sản & Các Phòng Ban',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353865/lumen/vocabulary/topics/photo_1560518883-ce09059eeffa.webp',
  },
  'Board Meeting & Committees': {
    vi: 'Họp Hội Đồng & Ủy Ban',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353863/lumen/vocabulary/topics/photo_1517245386807-bb43f82c33c4.webp',
  },
  'Quality Control': {
    vi: 'Kiểm Soát Chất Lượng',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353853/lumen/vocabulary/topics/photo_1581091226825-a6a2a5aee158.jpg',
  },
  'Product Development': {
    vi: 'Phát Triển Sản Phẩm',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353847/lumen/vocabulary/topics/photo_1581291518857-4e27b48ff24e.webp',
  },
  'Renting and Leasing': {
    vi: 'Thuê và Cho Thuê',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353870/lumen/vocabulary/topics/photo_1560448204-e02f11c3d0e2.webp',
  },
  'Selecting A Restaurant': {
    vi: 'Chọn Nhà Hàng',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353845/lumen/vocabulary/topics/photo_1517248135467-4c7edcad34c4.webp',
  },
  'Eating Out': {
    vi: 'Ăn Ngoài',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353866/lumen/vocabulary/topics/photo_1555396273-367ea4eb4db5.jpg',
  },
  'Ordering Lunch': {
    vi: 'Đặt Cơm Trưa',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353861/lumen/vocabulary/topics/photo_1546069901-ba9599a7e63c.webp',
  },
  'Cooking As A Career': {
    vi: 'Nghề Đầu Bếp',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353870/lumen/vocabulary/topics/photo_1577219491135-ce391730fb2c.webp',
  },
  Events: {
    vi: 'Sự Kiện',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353850/lumen/vocabulary/topics/photo_1511795409834-ef04bbd61622.webp',
  },
  'General Travel': {
    vi: 'Du Lịch Tổng Hợp',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353869/lumen/vocabulary/topics/photo_1488646953014-85cb44e25828.jpg',
  },
  Airlines: {
    vi: 'Hãng Hàng Không',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353852/lumen/vocabulary/topics/photo_1436491865332-7a61a109cc05.webp',
  },
  Trains: {
    vi: 'Tàu Hỏa',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353852/lumen/vocabulary/topics/photo_1474487548417-781cb71495f3.webp',
  },
  Hotels: {
    vi: 'Khách Sạn',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353870/lumen/vocabulary/topics/photo_1566073771259-6a8506099945.webp',
  },
  'Car Rentals': {
    vi: 'Thuê Xe Hơi',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353848/lumen/vocabulary/topics/photo_1549317661-bd32c8ce0db2.webp',
  },
  Movies: {
    vi: 'Rạp Chiếu Phim',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353860/lumen/vocabulary/topics/photo_1489599849927-2ee91cede3ba.webp',
  },
  Theater: {
    vi: 'Nhà Hát',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353867/lumen/vocabulary/topics/photo_1507676184212-d03ab07a01bf.webp',
  },
  Music: {
    vi: 'Âm Nhạc',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353875/lumen/vocabulary/topics/photo_1511671782779-c97d3d27a1d4.webp',
  },
  Museums: {
    vi: 'Bảo Tàng',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353858/lumen/vocabulary/topics/photo_1565008447742-97f6f38c985c.webp',
  },
  Media: {
    vi: 'Truyền Thông',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353856/lumen/vocabulary/topics/photo_1495020689067-958852a7765e.webp',
  },
  "Doctor's Office": {
    vi: 'Phòng Khám Bác Sĩ',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353859/lumen/vocabulary/topics/photo_1622253692010-333f2da6031d.webp',
  },
  "Dentist's Office": {
    vi: 'Phòng Khám Nha Sĩ',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353874/lumen/vocabulary/topics/photo_1588776814546-1ffcf47267a5.webp',
  },
  Health: {
    vi: 'Sức Khỏe',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353848/lumen/vocabulary/topics/photo_1505751172876-fa1923c5c528.webp',
  },
  Hospitals: {
    vi: 'Bệnh Viện',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353858/lumen/vocabulary/topics/photo_1587351021759-3e566b6af7cc.webp',
  },
  Pharmacy: {
    vi: 'Hiệu Thuốc',
    image:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353873/lumen/vocabulary/topics/photo_1586015555751-63bb77f4322a.webp',
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

function getCloudinaryAudioUrls(term: string) {
  const sanitizedTerm = term
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '_');
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dms9jruo5';
  return {
    us: `https://res.cloudinary.com/${cloudName}/video/upload/lumen/vocabulary/audio/us/${sanitizedTerm}.mp3`,
    uk: `https://res.cloudinary.com/${cloudName}/video/upload/lumen/vocabulary/audio/uk/${sanitizedTerm}.mp3`,
  };
}

function getCloudinaryImageUrl(term: string, fallbackUrl?: string) {
  const sanitizedTerm = term
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '_');
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dms9jruo5';
  if (fallbackUrl && fallbackUrl.includes('cloudinary')) {
    if (
      fallbackUrl.endsWith('.jpg') ||
      fallbackUrl.endsWith('.png') ||
      fallbackUrl.endsWith('.jpeg')
    ) {
      return fallbackUrl.replace(/\.(jpg|png|jpeg)$/i, '.webp');
    }
    return fallbackUrl;
  }
  return `https://res.cloudinary.com/${cloudName}/image/upload/lumen/vocabulary/images/${sanitizedTerm}.webp`;
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
  const existingWords = await wordRepo.find();
  const wordMapByTerm = new Map<string, WordEntity>();
  existingWords.forEach((w) => wordMapByTerm.set(w.term, w));

  // 1. Ensure Single Master TOEIC Folder Exists
  const allSysFolders = await folderRepo.find({ where: { isSystem: true } });
  let masterFolder =
    allSysFolders.find((f) => {
      const en = typeof f.name === 'string' ? f.name : f.name?.en || '';
      return (
        en === '600 Essential Words for TOEIC' ||
        en.includes('600 Essential Words')
      );
    }) || null;

  if (!masterFolder) {
    masterFolder = new FolderEntity();
    masterFolder.name = {
      en: '600 Essential Words for TOEIC',
      vi: '600 từ vựng TOEIC cốt lõi',
    };
    masterFolder.description = {
      en: 'Master 600 essential vocabulary words for TOEIC across 50 topics.',
      vi: 'Nắm vững 600 từ vựng cốt lõi luyện thi TOEIC theo 50 chủ đề.',
    };
    masterFolder.authorId = systemUser.id;
    masterFolder.category = {
      en: 'TOEIC Vocabulary',
      vi: 'Từ vựng TOEIC',
    };
    masterFolder.isSystem = true;
    masterFolder = await folderRepo.save(masterFolder);
    console.log(`Created Master TOEIC Folder: ${masterFolder.id}`);
  } else {
    // Ensure metadata is consistent
    masterFolder.name = {
      en: '600 Essential Words for TOEIC',
      vi: '600 từ vựng TOEIC cốt lõi',
    };
    masterFolder.category = {
      en: 'TOEIC Vocabulary',
      vi: 'Từ vựng TOEIC',
    };
    masterFolder.isSystem = true;
    masterFolder = await folderRepo.save(masterFolder);
  }

  // Clean up legacy split topic folders if any exist
  const legacyFolders = allSysFolders.filter((f) => f.id !== masterFolder.id);
  if (legacyFolders.length > 0) {
    const legacyIds = legacyFolders.map((f) => f.id);
    await flashcardRepo
      .createQueryBuilder()
      .delete()
      .where('"folderId" IN (:...legacyIds)', { legacyIds })
      .execute();
    await folderRepo
      .createQueryBuilder()
      .delete()
      .where('id IN (:...legacyIds)', { legacyIds })
      .execute();
    console.log(`Cleaned up ${legacyFolders.length} legacy topic folders.`);
  }

  // 2. Bulk Create & Update Words
  const newWordsToSave: WordEntity[] = [];
  const wordsToUpdate: WordEntity[] = [];

  for (const topicName of topics) {
    for (const item of topicMap[topicName]) {
      const term = item.english.trim();
      if (!term) continue;

      const audioUrls = getCloudinaryAudioUrls(term);
      const imageUrl = getCloudinaryImageUrl(term, item.image_url);

      const existingWord = wordMapByTerm.get(term);
      if (!existingWord) {
        const w = new WordEntity();
        w.term = term;
        w.phonetic = item.pronounce || null;
        w.phoneticUs = item.pronounce || null;
        w.audioUrl = audioUrls.us;
        w.audioUsUrl = audioUrls.us;
        w.audioUkUrl = audioUrls.uk;
        w.cefrLevel = 'B1';
        w.topic = { en: topicName, vi: TOPICS_METADATA[topicName]?.vi || topicName };
        w.topicImageUrl = TOPICS_METADATA[topicName]?.image || null;
        newWordsToSave.push(w);
        wordMapByTerm.set(term, w);
      } else {
        let updated = false;
        if (
          !existingWord.imageUrl ||
          !existingWord.imageUrl.includes('cloudinary')
        ) {
          existingWord.imageUrl = imageUrl;
          updated = true;
        }
        if (
          !existingWord.audioUsUrl ||
          existingWord.audioUsUrl.includes('tflat')
        ) {
          existingWord.audioUsUrl = audioUrls.us;
          updated = true;
        }
        if (
          !existingWord.audioUkUrl ||
          existingWord.audioUkUrl.includes('tflat')
        ) {
          existingWord.audioUkUrl = audioUrls.uk;
          updated = true;
        }
        if (!existingWord.audioUrl || existingWord.audioUrl.includes('tflat')) {
          existingWord.audioUrl = audioUrls.us;
          updated = true;
        }
        if (!existingWord.phoneticUs && item.pronounce) {
          existingWord.phoneticUs = item.pronounce;
          updated = true;
        }
        if (!existingWord.topic) {
          existingWord.topic = { en: topicName, vi: TOPICS_METADATA[topicName]?.vi || topicName };
          existingWord.topicImageUrl =
            TOPICS_METADATA[topicName]?.image || null;
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
      `Updated audio/imageUrl/topic for ${wordsToUpdate.length} existing Words.`,
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

  // 3. Bulk Create Definitions, Examples & Flashcards for Master Folder
  const definitionsToSave: DefinitionEntity[] = [];
  const examplesToSave: ExampleEntity[] = [];
  const flashcardsToSave: FlashcardEntity[] = [];

  const existingFlashcards = await flashcardRepo.find({
    where: { folderId: masterFolder.id },
  });
  const flashcardSet = new Set<string>();
  existingFlashcards.forEach((f) => flashcardSet.add(f.wordId));

  const existingDefs = await definitionRepo.find();
  const defWordSet = new Set<string>();
  existingDefs.forEach((df) => defWordSet.add(df.wordId));

  for (const topicName of topics) {
    for (const item of topicMap[topicName]) {
      const term = item.english.trim();
      const word = wordMapByTerm.get(term);
      if (!word) continue;

      // Link to Master TOEIC Folder
      if (!flashcardSet.has(word.id)) {
        const fc = new FlashcardEntity();
        fc.folderId = masterFolder.id;
        fc.wordId = word.id;
        flashcardsToSave.push(fc);
        flashcardSet.add(word.id);
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
          ex.definition = def;
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
    console.log(`Bulk saved ${savedFc.length} Flashcards to Master Folder.`);
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
