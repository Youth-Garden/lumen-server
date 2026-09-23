import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import {
  convertAndUploadImageToWebp,
  ensureCloudinaryConfig,
} from './contexts/vocabulary/infrastructure/helpers/cloudinary-image.helper';

dotenv.config();
ensureCloudinaryConfig();

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
});

interface WordImageRecord {
  id: string;
  term: string;
  imageUrl: string;
}

async function runWebpImageMigration(): Promise<void> {
  console.log('=== Starting Cloudinary & Database WebP Image Migration ===');

  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL environment variable is missing.');
    process.exit(1);
  }

  console.log('Connecting to PostgreSQL database...');
  await dataSource.initialize();
  console.log('Connected to database.');

  try {
    const records: WordImageRecord[] = await dataSource.query(
      'SELECT id, term, "imageUrl" FROM vocab_words WHERE "imageUrl" IS NOT NULL',
    );

    console.log(`Found ${records.length} total words with imageUrl.`);

    const needsConversion = records.filter(
      (r) => r.imageUrl && !r.imageUrl.toLowerCase().endsWith('.webp'),
    );

    const alreadyWebp = records.length - needsConversion.length;
    console.log(`- Already in WebP format: ${alreadyWebp}`);
    console.log(`- Need conversion to WebP: ${needsConversion.length}`);

    if (needsConversion.length === 0) {
      console.log('All vocabulary images are already in WebP format!');
      return;
    }

    let successCount = 0;
    let failedCount = 0;
    const batchSize = 5;

    for (let i = 0; i < needsConversion.length; i += batchSize) {
      const batch = needsConversion.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (record) => {
          const sanitizedTerm = record.term
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]/g, '_');

          try {
            const webpUrl = await convertAndUploadImageToWebp(record.imageUrl, {
              folder: 'lumen/vocabulary/images',
              publicId: sanitizedTerm,
              overwrite: true,
            });

            if (webpUrl) {
              await dataSource.query(
                'UPDATE vocab_words SET "imageUrl" = $1 WHERE id = $2',
                [webpUrl, record.id],
              );
              successCount++;
              console.log(
                `[${successCount + failedCount}/${needsConversion.length}] Converted: ${record.term} -> ${webpUrl}`,
              );
            } else {
              failedCount++;
              console.warn(
                `[WARN] Failed to convert image for word: ${record.term}`,
              );
            }
          } catch (err) {
            failedCount++;
            console.error(`[ERROR] Word ${record.term}:`, err);
          }
        }),
      );
    }

    console.log('\n=== Migration Completed ===');
    console.log(`- Successfully converted: ${successCount}`);
    console.log(`- Failed: ${failedCount}`);
    console.log(
      `- Total WebP images in database: ${alreadyWebp + successCount}`,
    );
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await dataSource.destroy();
    console.log('Database connection closed.');
  }
}

void runWebpImageMigration();
