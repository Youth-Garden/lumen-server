import * as dotenv from 'dotenv';
import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';
import { DataSource } from 'typeorm';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
});

interface WordRow {
  id: string;
  term: string;
  audioUsUrl: string | null;
  audioUkUrl: string | null;
  phoneticUs: string | null;
  phoneticUk: string | null;
}

interface DictionaryPhonetic {
  text?: string;
  audio?: string;
}

interface DictionaryResponse {
  phonetics?: DictionaryPhonetic[];
}

async function fetchUkAudioBuffer(term: string): Promise<Buffer> {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en-GB&client=tw-ob&q=${encodeURIComponent(term)}`;
  const response = await axios.get<ArrayBuffer>(url, {
    responseType: 'arraybuffer',
    timeout: 8000,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });
  return Buffer.from(response.data);
}

async function fetchUkPhonetic(term: string): Promise<string | null> {
  try {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(term)}`;
    const response = await axios.get<DictionaryResponse[]>(url, {
      timeout: 4000,
      headers: { 'User-Agent': 'Lumen-Vocab-Service/1.0' },
    });
    const phonetics = response.data?.[0]?.phonetics || [];
    for (const p of phonetics) {
      if (p.text && (p.audio?.includes('-uk.') || p.audio?.includes('/uk/'))) {
        return p.text;
      }
    }
    for (const p of phonetics) {
      if (p.text) return p.text;
    }
  } catch {
    // Ignore error
  }
  return null;
}

async function uploadAudioBuffer(
  buffer: Buffer,
  folder: string,
  publicId: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: 'video',
        overwrite: true,
      },
      (error, result) => {
        if (error || !result) {
          reject(
            error instanceof Error
              ? error
              : new Error(
                  typeof error === 'string'
                    ? error
                    : JSON.stringify(error) || 'Upload failed',
                ),
          );
        } else {
          resolve(result.secure_url);
        }
      },
    );
    stream.end(buffer);
  });
}

async function main(): Promise<void> {
  console.log('=== Starting UK Audio Enrichment & Cloudinary Sync ===');
  await dataSource.initialize();
  console.log('Connected to Database.');

  // Ensure columns exist
  await dataSource.query(
    'ALTER TABLE vocab_words ADD COLUMN IF NOT EXISTS "audioUkUrl" varchar',
  );
  await dataSource.query(
    'ALTER TABLE vocab_words ADD COLUMN IF NOT EXISTS "phoneticUk" varchar',
  );

  const words: WordRow[] = await dataSource.query(`
    SELECT id, term, "audioUsUrl", "audioUkUrl", "phoneticUs", "phoneticUk"
    FROM vocab_words
    ORDER BY term ASC
  `);

  console.log(`Total words in database: ${words.length}`);

  let updatedCount = 0;
  let errorCount = 0;
  const concurrency = 8;

  for (let i = 0; i < words.length; i += concurrency) {
    const chunk = words.slice(i, i + concurrency);

    await Promise.all(
      chunk.map(async (word) => {
        const cleanTerm = word.term.trim();
        const sanitizedId = cleanTerm
          .toLowerCase()
          .replace(/[^a-z0-9_-]/g, '_');

        try {
          // 1. Fetch and upload UK audio if not already uploaded to Cloudinary
          let ukUrl = word.audioUkUrl;
          const isUkOnCloudinary =
            ukUrl &&
            ukUrl.includes('res.cloudinary.com') &&
            ukUrl.includes('/audio/uk/');

          if (!isUkOnCloudinary) {
            const ukAudioBuffer = await fetchUkAudioBuffer(cleanTerm);
            ukUrl = await uploadAudioBuffer(
              ukAudioBuffer,
              'lumen/vocabulary/audio/uk',
              sanitizedId,
            );
          }

          // 2. Fetch UK phonetic if missing
          let ukPhonetic = word.phoneticUk;
          if (!ukPhonetic) {
            ukPhonetic = await fetchUkPhonetic(cleanTerm);
          }

          // 3. Update database
          await dataSource.query(
            `UPDATE vocab_words 
             SET "audioUkUrl" = $1,
                 "phoneticUk" = COALESCE($2, "phoneticUk")
             WHERE id = $3`,
            [ukUrl, ukPhonetic, word.id],
          );

          updatedCount++;
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          console.error(`[ERROR] ${cleanTerm}:`, msg);
          errorCount++;
        }
      }),
    );

    const processed = Math.min(i + concurrency, words.length);
    if (processed % 40 === 0 || processed === words.length) {
      console.log(
        `[PROGRESS] Processed ${processed}/${words.length} words (Updated: ${updatedCount}, Errors: ${errorCount})...`,
      );
    }
  }

  console.log('\n=== UK Audio Enrichment Complete ===');
  console.log(`Successfully Updated Words with UK Voice: ${updatedCount}`);
  console.log(`Errors: ${errorCount}`);

  // Print final verification stats
  const [finalStats] = await dataSource.query<
    Array<{ total: string; has_us: string; has_uk: string }>
  >(`
    SELECT 
      count(*) as total,
      count("audioUsUrl") as has_us,
      count("audioUkUrl") as has_uk
    FROM vocab_words
  `);
  console.log('Final Audio Stats in Database:', finalStats);

  await dataSource.destroy();
}

main().catch((err) => {
  console.error('Fatal error running UK audio enrichment:', err);
  process.exit(1);
});
