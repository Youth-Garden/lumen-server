import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
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

interface ParsedWord {
  english: string;
  topic: string;
  imageUrl: string;
  audioUrl: string;
}

const CLOUDINARY_IMAGE_FOLDER = 'lumen/vocabulary/images';
const CLOUDINARY_AUDIO_FOLDER = 'lumen/vocabulary/audio';

function parseCSV(text: string): ParsedWord[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const header = lines[0].split(',').map((h) => h.trim());
  const rows: ParsedWord[] = [];

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

      rows.push({
        english: obj.english || '',
        topic: obj.topic || '',
        imageUrl: obj.image_url || '',
        audioUrl: obj.audio_url || '',
      });
    }
  }
  return rows;
}

function buildFileIndex(dir: string): Map<string, string> {
  const index = new Map<string, string>();
  if (!fs.existsSync(dir)) return index;

  function traverse(currentDir: string): void {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        traverse(fullPath);
      } else {
        index.set(entry.name.toLowerCase(), fullPath);
      }
    }
  }

  traverse(dir);
  return index;
}

async function uploadToCloudinary(
  filePath: string,
  folder: string,
  publicId: string,
  resourceType: 'image' | 'video',
): Promise<string> {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    public_id: publicId,
    overwrite: true,
    resource_type: resourceType,
    ...(resourceType === 'image'
      ? {
          format: 'webp',
          transformation: [{ quality: 'auto', fetch_format: 'webp' }],
        }
      : {}),
  });
  return result.secure_url;
}

async function cleanOldToeicFolders(): Promise<void> {
  console.log('Cleaning up old lumen/toeic assets from Cloudinary...');
  try {
    await cloudinary.api.delete_resources_by_prefix('lumen/toeic/', {
      resource_type: 'image',
    });
  } catch {
    // Ignore if no assets
  }

  try {
    await cloudinary.api.delete_resources_by_prefix('lumen/toeic/', {
      resource_type: 'video',
    });
  } catch {
    // Ignore if no assets
  }

  try {
    await cloudinary.api.delete_folder('lumen/toeic/images');
  } catch {
    // Ignore if folder does not exist
  }

  try {
    await cloudinary.api.delete_folder('lumen/toeic');
    console.log(
      'Successfully cleaned up old lumen/toeic folder on Cloudinary.',
    );
  } catch {
    // Ignore if folder not empty or doesn't exist
  }
}

async function main(): Promise<void> {
  console.log('--- Starting Vocabulary Cloudinary Upload & Sync ---');
  console.log(`Image Folder: ${CLOUDINARY_IMAGE_FOLDER}`);
  console.log(`Audio Folder: ${CLOUDINARY_AUDIO_FOLDER}`);

  await cleanOldToeicFolders();

  console.log('Connecting to database...');
  await dataSource.initialize();
  console.log('Connected to PostgreSQL database.');

  // Ensure columns exist
  await dataSource.query(
    'ALTER TABLE vocab_words ADD COLUMN IF NOT EXISTS "imageUrl" varchar',
  );
  await dataSource.query(
    'ALTER TABLE vocab_words ADD COLUMN IF NOT EXISTS "audioUrl" varchar',
  );
  await dataSource.query(
    'ALTER TABLE vocab_words ADD COLUMN IF NOT EXISTS "audioUsUrl" varchar',
  );

  const dbWords: Array<{
    id: string;
    term: string;
    imageUrl: string | null;
    audioUrl: string | null;
  }> = await dataSource.query(
    'SELECT id, term, "imageUrl", "audioUrl" FROM vocab_words',
  );

  const dbWordMap = new Map<
    string,
    { id: string; imageUrl: string | null; audioUrl: string | null }
  >();
  for (const w of dbWords) {
    dbWordMap.set(w.term.toLowerCase().trim(), {
      id: w.id,
      imageUrl: w.imageUrl,
      audioUrl: w.audioUrl,
    });
  }

  const csvPath = path.join(
    __dirname,
    '../../toeic-600-words-dataset/data/toeic_600_words.csv',
  );
  const mediaBaseDir = path.join(
    __dirname,
    '../../toeic-600-words-dataset/media',
  );

  const imageIndex = buildFileIndex(path.join(mediaBaseDir, 'images'));
  const audioIndex = buildFileIndex(path.join(mediaBaseDir, 'audio'));

  console.log(`Indexed ${imageIndex.size} local image files.`);
  console.log(`Indexed ${audioIndex.size} local audio files.`);

  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const words = parseCSV(csvContent);

  console.log(
    `Loaded ${words.length} entries from CSV. Matching with ${dbWordMap.size} database words.`,
  );

  // Group by unique term
  const uniqueWordsMap = new Map<string, ParsedWord>();
  for (const item of words) {
    const key = item.english.toLowerCase().trim();
    if (!uniqueWordsMap.has(key)) {
      uniqueWordsMap.set(key, item);
    }
  }

  const uniqueWords = Array.from(uniqueWordsMap.values());
  console.log(`Unique vocabulary words to process: ${uniqueWords.length}`);

  let uploadedImages = 0;
  let uploadedAudios = 0;
  let updatedDbWords = 0;
  let errors = 0;

  // Process in chunks of 10 concurrent items
  const concurrency = 10;
  for (let i = 0; i < uniqueWords.length; i += concurrency) {
    const chunk = uniqueWords.slice(i, i + concurrency);

    await Promise.all(
      chunk.map(async (item) => {
        const termKey = item.english.toLowerCase().trim();
        const dbEntry = dbWordMap.get(termKey);
        if (!dbEntry) return;

        const sanitizedTerm = termKey.replace(/[^a-z0-9_-]/g, '_');
        let newImageUrl: string | null = null;
        let newAudioUrl: string | null = null;

        // 1. Resolve & Upload Image
        const imageFileName = path.basename(item.imageUrl || '').toLowerCase();
        let localImagePath = imageIndex.get(imageFileName);
        if (!localImagePath) {
          localImagePath =
            imageIndex.get(`${sanitizedTerm}.jpg`) ||
            imageIndex.get(`${sanitizedTerm}.png`) ||
            imageIndex.get(`${sanitizedTerm}1.jpg`) ||
            imageIndex.get(`${sanitizedTerm}1.png`);
        }

        if (localImagePath && fs.existsSync(localImagePath)) {
          // Check if already on new Cloudinary folder
          const alreadyNewCloudinary =
            dbEntry.imageUrl &&
            dbEntry.imageUrl.includes(CLOUDINARY_IMAGE_FOLDER);

          if (!alreadyNewCloudinary) {
            try {
              newImageUrl = await uploadToCloudinary(
                localImagePath,
                CLOUDINARY_IMAGE_FOLDER,
                sanitizedTerm,
                'image',
              );
              uploadedImages++;
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : String(err);
              console.error(`[IMAGE ERROR] ${item.english}:`, msg);
              errors++;
            }
          } else {
            newImageUrl = dbEntry.imageUrl;
          }
        }

        // 2. Resolve & Upload Audio
        const audioFileName = path.basename(item.audioUrl || '').toLowerCase();
        let localAudioPath = audioIndex.get(audioFileName);
        if (!localAudioPath) {
          localAudioPath = audioIndex.get(`${sanitizedTerm}.mp3`);
        }

        if (localAudioPath && fs.existsSync(localAudioPath)) {
          // Check if already on new Cloudinary folder
          const alreadyNewCloudinaryAudio =
            dbEntry.audioUrl &&
            dbEntry.audioUrl.includes(CLOUDINARY_AUDIO_FOLDER);

          if (!alreadyNewCloudinaryAudio) {
            try {
              newAudioUrl = await uploadToCloudinary(
                localAudioPath,
                CLOUDINARY_AUDIO_FOLDER,
                sanitizedTerm,
                'video',
              );
              uploadedAudios++;
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : String(err);
              console.error(`[AUDIO ERROR] ${item.english}:`, msg);
              errors++;
            }
          } else {
            newAudioUrl = dbEntry.audioUrl;
          }
        }

        // 3. Update Database if URLs changed
        if (newImageUrl || newAudioUrl) {
          try {
            await dataSource.query(
              `UPDATE vocab_words 
               SET "imageUrl" = COALESCE($1, "imageUrl"),
                   "audioUrl" = COALESCE($2, "audioUrl"),
                   "audioUsUrl" = COALESCE($2, "audioUsUrl")
               WHERE id = $3`,
              [newImageUrl, newAudioUrl, dbEntry.id],
            );
            updatedDbWords++;
          } catch (dbErr: unknown) {
            const msg = dbErr instanceof Error ? dbErr.message : String(dbErr);
            console.error(`[DB ERROR] ${item.english}:`, msg);
            errors++;
          }
        }
      }),
    );

    const processed = Math.min(i + concurrency, uniqueWords.length);
    console.log(
      `[PROGRESS] Processed ${processed}/${uniqueWords.length} words (Images uploaded: ${uploadedImages}, Audios uploaded: ${uploadedAudios}, DB updated: ${updatedDbWords})...`,
    );
  }

  console.log('\n=== Vocabulary Cloudinary Sync Finished ===');
  console.log(
    `Images Uploaded to ${CLOUDINARY_IMAGE_FOLDER}: ${uploadedImages}`,
  );
  console.log(
    `Audios Uploaded to ${CLOUDINARY_AUDIO_FOLDER}: ${uploadedAudios}`,
  );
  console.log(`Database Words Updated: ${updatedDbWords}`);
  console.log(`Errors: ${errors}`);

  await dataSource.destroy();
}

main().catch((err) => {
  console.error('Fatal error running Vocabulary Cloudinary upload:', err);
  process.exit(1);
});
