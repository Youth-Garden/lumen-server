import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
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

const CLOUDINARY_TOPIC_FOLDER = 'lumen/vocabulary/topics';
const CLOUDINARY_WORD_FOLDER = 'lumen/vocabulary/words';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string,
  publicId: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        overwrite: true,
        resource_type: 'image',
        transformation: [
          {
            width: 400,
            height: 400,
            crop: 'fill',
            quality: 'auto',
            fetch_format: 'auto',
          },
        ],
      },
      (error, result) => {
        if (error || !result) {
          return reject(
            error instanceof Error
              ? error
              : new Error(
                  typeof error === 'object' && error !== null
                    ? JSON.stringify(error)
                    : 'Upload to Cloudinary failed',
                ),
          );
        }
        resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });
}

async function fetchImageBuffer(url: string): Promise<Buffer | null> {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });
    return Buffer.from(response.data);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[FETCH WARNING] Failed to download image from ${url}:`, msg);
    return null;
  }
}

async function main() {
  console.log('=== Starting Topic & Word Cloudinary Image Pipeline ===');

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is missing.');
    process.exit(1);
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.error('Cloudinary credentials environment variables are missing.');
    process.exit(1);
  }

  await dataSource.initialize();
  console.log('Database connection initialized.');

  // 1. Process Topic Cover Images
  console.log('\n--- Step 1: Processing Topic Cover Images ---');
  const topics: Array<{ topic: string; topicImageUrl: string | null }> =
    await dataSource.query(
      `SELECT DISTINCT topic, "topicImageUrl" FROM vocab_words WHERE topic IS NOT NULL`,
    );

  let uploadedTopicCount = 0;
  let skippedTopicCount = 0;
  const updatedTopicMap: Record<string, string> = {};

  for (const row of topics) {
    if (!row.topic) continue;

    const topicSlug = slugify(row.topic);
    const existingUrl = row.topicImageUrl || '';

    // Resource Optimization: Check if already on Cloudinary
    if (
      existingUrl.includes('res.cloudinary.com') &&
      existingUrl.includes(CLOUDINARY_TOPIC_FOLDER)
    ) {
      console.log(`[SKIP TOPIC] "${row.topic}" is already on Cloudinary.`);
      skippedTopicCount++;
      updatedTopicMap[row.topic] = existingUrl;
      continue;
    }

    if (existingUrl && existingUrl.startsWith('http')) {
      console.log(
        `[UPLOADING TOPIC] Processing "${row.topic}" from ${existingUrl}...`,
      );
      const buffer = await fetchImageBuffer(existingUrl);
      if (buffer) {
        try {
          const cdnUrl = await uploadBufferToCloudinary(
            buffer,
            CLOUDINARY_TOPIC_FOLDER,
            topicSlug,
          );
          await dataSource.query(
            `UPDATE vocab_words SET "topicImageUrl" = $1 WHERE topic = $2`,
            [cdnUrl, row.topic],
          );
          updatedTopicMap[row.topic] = cdnUrl;
          uploadedTopicCount++;
          console.log(`[SUCCESS TOPIC] "${row.topic}" -> ${cdnUrl}`);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          console.error(`[ERROR TOPIC] "${row.topic}":`, msg);
        }
      }
      await sleep(200);
    }
  }

  // 2. Process Word Images
  console.log('\n--- Step 2: Processing Vocabulary Word Images ---');
  const words: Array<{ id: string; term: string; imageUrl: string | null }> =
    await dataSource.query(
      `SELECT id, term, "imageUrl" FROM vocab_words WHERE "imageUrl" IS NOT NULL AND "imageUrl" != ''`,
    );

  let uploadedWordCount = 0;
  let skippedWordCount = 0;

  for (const row of words) {
    const existingUrl = row.imageUrl || '';
    const wordSlug = slugify(row.term);

    // Resource Optimization: Check if already on Cloudinary
    if (
      existingUrl.includes('res.cloudinary.com') &&
      existingUrl.includes(CLOUDINARY_WORD_FOLDER)
    ) {
      skippedWordCount++;
      continue;
    }

    if (existingUrl.startsWith('http')) {
      console.log(`[UPLOADING WORD] Processing "${row.term}"...`);
      const buffer = await fetchImageBuffer(existingUrl);
      if (buffer) {
        try {
          const cdnUrl = await uploadBufferToCloudinary(
            buffer,
            CLOUDINARY_WORD_FOLDER,
            wordSlug,
          );
          await dataSource.query(
            `UPDATE vocab_words SET "imageUrl" = $1 WHERE id = $2`,
            [cdnUrl, row.id],
          );
          uploadedWordCount++;
          console.log(`[SUCCESS WORD] "${row.term}" -> ${cdnUrl}`);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          console.error(`[ERROR WORD] "${row.term}":`, msg);
        }
      }
      await sleep(150);
    }
  }

  console.log('\n=== Summary of Image Sync ===');
  console.log(`Topics uploaded to Cloudinary: ${uploadedTopicCount}`);
  console.log(`Topics skipped (already on Cloudinary): ${skippedTopicCount}`);
  console.log(`Words uploaded to Cloudinary: ${uploadedWordCount}`);
  console.log(`Words skipped (already on Cloudinary): ${skippedWordCount}`);

  await dataSource.destroy();
  console.log('Database connection closed.');
}

main().catch((err) => {
  console.error('Fatal error running Cloudinary image pipeline:', err);
  process.exit(1);
});
