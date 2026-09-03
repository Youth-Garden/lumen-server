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
}

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
      });
    }
  }
  return rows;
}

async function uploadFileToCloudinary(
  filePath: string,
  publicId: string,
): Promise<string> {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'lumen/toeic/images',
    public_id: publicId,
    overwrite: false,
    resource_type: 'image',
  });
  return result.secure_url;
}

async function main() {
  console.log('Connecting to database...');
  await dataSource.initialize();
  console.log('Connected to PostgreSQL database.');

  // Ensure column exists
  await dataSource.query(
    'ALTER TABLE vocab_words ADD COLUMN IF NOT EXISTS "imageUrl" varchar',
  );

  // Fetch existing words from DB
  const dbWords: Array<{ id: string; term: string; imageUrl: string | null }> =
    await dataSource.query('SELECT id, term, "imageUrl" FROM vocab_words');
  const dbWordMap = new Map<string, { id: string; imageUrl: string | null }>();
  for (const w of dbWords) {
    dbWordMap.set(w.term.toLowerCase().trim(), {
      id: w.id,
      imageUrl: w.imageUrl,
    });
  }

  const csvPath = path.join(
    __dirname,
    '../../toeic-600-words-dataset/data/toeic_600_words.csv',
  );
  const mediaBaseDir = path.join(
    __dirname,
    '../../toeic-600-words-dataset/media/images',
  );
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const words = parseCSV(csvContent);

  console.log(
    `Loaded ${words.length} words from CSV. Existing words in DB: ${dbWordMap.size}`,
  );

  let uploadedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  // Process in chunks of 8 concurrent uploads
  const chunkSize = 8;
  for (let i = 0; i < words.length; i += chunkSize) {
    const chunk = words.slice(i, i + chunkSize);
    await Promise.all(
      chunk.map(async (item) => {
        const termKey = item.english.toLowerCase().trim();
        const dbEntry = dbWordMap.get(termKey);

        if (!dbEntry) {
          return;
        }

        // Check if already uploaded to Cloudinary
        if (
          dbEntry.imageUrl &&
          dbEntry.imageUrl.includes('res.cloudinary.com')
        ) {
          skippedCount++;
          return;
        }

        const fileName = path.basename(item.imageUrl || '');
        const localFilePath = path.join(
          mediaBaseDir,
          item.topic.trim(),
          fileName,
        );

        if (!fs.existsSync(localFilePath)) {
          console.warn(
            `[MISSING] Image file not found for "${item.english}": ${localFilePath}`,
          );
          errorCount++;
          return;
        }

        try {
          const sanitizedId = termKey.replace(/[^a-z0-9_-]/g, '_');
          const secureUrl = await uploadFileToCloudinary(
            localFilePath,
            sanitizedId,
          );

          // Update DB
          await dataSource.query(
            'UPDATE vocab_words SET "imageUrl" = $1 WHERE id = $2',
            [secureUrl, dbEntry.id],
          );

          uploadedCount++;
          if (uploadedCount % 20 === 0 || uploadedCount === words.length) {
            console.log(
              `[PROGRESS] Uploaded & updated ${uploadedCount}/${words.length} words to Cloudinary...`,
            );
          }
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          console.error(
            `[ERROR] Failed to upload ${item.english}:`,
            errorMessage,
          );
          errorCount++;
        }
      }),
    );
  }

  console.log(`\n=== Cloudinary TOEIC Upload Finished ===`);
  console.log(`Total Uploaded & Updated: ${uploadedCount}`);
  console.log(`Already Had Cloudinary URL: ${skippedCount}`);
  console.log(`Errors: ${errorCount}`);

  await dataSource.destroy();
}

main().catch((err) => {
  console.error('Fatal error running Cloudinary upload:', err);
  process.exit(1);
});
