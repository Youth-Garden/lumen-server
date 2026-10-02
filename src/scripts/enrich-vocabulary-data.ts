import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { AppModule } from '../app.module';

interface DatamuseResult {
  word: string;
  defs?: string[];
  tags?: string[];
}

const LOG_DIR = path.resolve(__dirname, '../../logs');
const LOG_FILE = path.join(LOG_DIR, 'vocabulary-enrichment.log');

function logToFile(message: string) {
  try {
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    }
    const timestamp = new Date().toISOString();
    fs.appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`, 'utf8');
  } catch (err) {
    console.error('Failed to write log file:', err);
  }
}

const ARPABET_MAP: Record<string, string> = {
  AA: 'ɑː',
  AE: 'æ',
  AH: 'ə',
  AO: 'ɔː',
  AW: 'aʊ',
  AY: 'aɪ',
  B: 'b',
  CH: 'tʃ',
  D: 'd',
  DH: 'ð',
  EH: 'ɛ',
  ER: 'ər',
  EY: 'eɪ',
  F: 'f',
  G: 'ɡ',
  HH: 'h',
  IH: 'ɪ',
  IY: 'iː',
  JH: 'dʒ',
  K: 'k',
  L: 'l',
  M: 'm',
  N: 'n',
  NG: 'ŋ',
  OW: 'oʊ',
  OY: 'ɔɪ',
  P: 'p',
  R: 'r',
  S: 's',
  SH: 'ʃ',
  T: 't',
  TH: 'θ',
  UH: 'ʊ',
  UW: 'uː',
  V: 'v',
  W: 'w',
  Y: 'j',
  Z: 'z',
  ZH: 'ʒ',
};

function arpabetToIpa(arpabetString: string): string {
  const tokens = arpabetString.trim().split(/\s+/);
  let ipa = '';

  for (const token of tokens) {
    const phone = token.replace(/[012]/g, '');
    const stress = token.match(/[012]/)?.[0];
    const ipaSymbol = ARPABET_MAP[phone] || phone.toLowerCase();

    if (stress === '1') {
      ipa += 'ˈ' + ipaSymbol;
    } else if (stress === '2') {
      ipa += 'ˌ' + ipaSymbol;
    } else {
      ipa += ipaSymbol;
    }
  }

  return `/${ipa}/`;
}

function normalizePartOfSpeech(pos: string): string {
  const clean = pos
    .toLowerCase()
    .trim()
    .replace(/[^a-z]/g, '');
  if (clean.startsWith('noun') || clean === 'n') return 'noun';
  if (clean.startsWith('verb') || clean === 'v') return 'verb';
  if (clean.startsWith('adj') || clean === 'adjective') return 'adjective';
  if (clean.startsWith('adv') || clean === 'adverb') return 'adverb';
  if (clean.startsWith('prep') || clean === 'preposition') return 'preposition';
  if (clean.startsWith('conj') || clean === 'conjunction') return 'conjunction';
  if (clean.startsWith('pron') || clean === 'pronoun') return 'pronoun';
  if (clean.startsWith('interj') || clean === 'interjection')
    return 'interjection';
  return 'noun';
}

function generateExampleSentence(term: string, pos: string): string {
  const cleanTerm = term.toLowerCase().trim();
  switch (pos) {
    case 'verb':
      return `They decided to ${cleanTerm} after careful consideration.`;
    case 'adjective':
      return `It was a very ${cleanTerm} experience for everyone involved.`;
    case 'adverb':
      return `She completed the task ${cleanTerm} and efficiently.`;
    default:
      return `The concept of ${cleanTerm} is widely recognized in daily life.`;
  }
}

import {
  VocabularyEnricherService,
  resolveVisualSearchQuery,
} from '../shared/infrastructure/enrichment';

const enricherService = new VocabularyEnricherService();

export async function fetchTermImage(
  term: string,
  searchQuery?: string,
): Promise<string | null> {
  return enricherService.fetchAndUploadWebpImage(term, searchQuery);
}

export async function translateText(
  text: string,
  targetLang = 'vi',
): Promise<string> {
  return enricherService.translate(text, targetLang);
}

async function fetchDictionaryMetadata(term: string) {
  return enricherService.fetchDictionaryMetadata(term);
}

async function safeQuery(
  dataSource: DataSource,
  query: string,
  parameters: any[],
  maxRetries = 3,
): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (!dataSource.isInitialized) {
        await dataSource.initialize();
      }
      return await dataSource.query(query, parameters);
    } catch (err: any) {
      if (attempt === maxRetries) throw err;
      console.warn(
        `[DB Retry ${attempt}/${maxRetries}] ${err.message}. Retrying in 1s...`,
      );
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}

export async function enrichWordData(targetTerm?: string) {
  console.log('🚀 Executing Complete Vocabulary Data Enrichment Pipeline...');
  logToFile(`========== START VOCABULARY ENRICHMENT SESSION ==========`);

  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    const whereClause = targetTerm
      ? `WHERE LOWER(w.term) = LOWER('${targetTerm.trim().replace(/'/g, "''")}')`
      : `WHERE d.definition->>'vi' IS NULL
         OR TRIM(d.definition->>'vi') = ''
         OR LOWER(TRIM(d.definition->>'vi')) = LOWER(TRIM(w.term))
         OR LOWER(TRIM(d.definition->>'vi')) = LOWER(TRIM(d.definition->>'en'))
         OR w."phoneticUs" IS NULL
         OR w."audioUsUrl" IS NULL
         OR w."imageUrl" IS NULL`;

    const targetRows: Array<{
      wordId: string;
      term: string;
      defId: string;
      partOfSpeech: string;
      definitionEn: string;
      definitionVi: string;
      phonetic: string | null;
      phoneticUs: string | null;
      phoneticUk: string | null;
      audioUsUrl: string | null;
      audioUkUrl: string | null;
      imageUrl: string | null;
    }> = await safeQuery(
      dataSource,
      `SELECT 
        w.id AS "wordId", 
        w.term, 
        d.id AS "defId", 
        d."partOfSpeech", 
        d.definition->>'en' AS "definitionEn",
        d.definition->>'vi' AS "definitionVi",
        w.phonetic,
        w."phoneticUs",
        w."phoneticUk",
        w."audioUsUrl",
        w."audioUkUrl",
        w."imageUrl"
      FROM vocab_words w
      JOIN vocab_definitions d ON d."wordId" = w.id
      ${whereClause}
      ORDER BY w.term ASC;`,
      [],
    );

    console.log(`📋 Found ${targetRows.length} vocabulary word(s) to enrich.`);
    logToFile(`Found ${targetRows.length} word(s) to enrich.`);

    let enrichedCount = 0;
    let failedCount = 0;
    const BATCH_SIZE = 10;

    for (let i = 0; i < targetRows.length; i += BATCH_SIZE) {
      const batch = targetRows.slice(i, i + BATCH_SIZE);
      const results = await Promise.all(
        batch.map(async (row) => {
          const term = row.term.trim().toLowerCase();
          const meta = await fetchDictionaryMetadata(term);

          let enDef =
            meta.enDef ||
            (row.definitionEn && row.definitionEn.toLowerCase() !== term
              ? row.definitionEn
              : '');
          let viDef = enDef ? await translateText(enDef, 'vi') : null;

          if (!viDef || viDef.toLowerCase() === term) {
            viDef = await translateText(term, 'vi');
          }

          if (!enDef) {
            enDef = `The term "${term}" in general and professional context.`;
          }
          const viExample = meta.enExample
            ? await translateText(meta.enExample, 'vi')
            : null;
          const searchQuery = resolveVisualSearchQuery(term, meta.pos, enDef);
          const imageUrl =
            row.imageUrl || (await fetchTermImage(term, searchQuery));

          try {
            // 1. Update Definition (EN + VI)
            await safeQuery(
              dataSource,
              `UPDATE vocab_definitions 
               SET "partOfSpeech" = $1, 
                   definition = jsonb_build_object('en', $2::text, 'vi', $3::text), 
                   updated_at = NOW() 
               WHERE id = $4::uuid;`,
              [meta.pos, enDef, viDef || enDef, row.defId],
            );

            // 2. Clean & Insert Unique Example (EN + VI)
            if (meta.enExample) {
              await safeQuery(
                dataSource,
                `DELETE FROM vocab_examples WHERE "definitionId" = $1::uuid;`,
                [row.defId],
              );

              await safeQuery(
                dataSource,
                `INSERT INTO vocab_examples (id, "definitionId", sentence, created_at, updated_at)
                 VALUES (gen_random_uuid(), $1::uuid, jsonb_build_object('en', $2::text, 'vi', $3::text), NOW(), NOW());`,
                [row.defId, meta.enExample, viExample || meta.enExample],
              );
            }

            // 3. Update Word (IPA, Audio URLs, Image URL)
            await safeQuery(
              dataSource,
              `UPDATE vocab_words 
               SET phonetic = COALESCE(phonetic, $1), 
                   "phoneticUs" = COALESCE("phoneticUs", $1), 
                   "phoneticUk" = COALESCE("phoneticUk", $2), 
                   "audioUsUrl" = COALESCE("audioUsUrl", $3),
                   "audioUkUrl" = COALESCE("audioUkUrl", $4),
                   "audioUrl" = COALESCE("audioUrl", $3),
                   "imageUrl" = COALESCE("imageUrl", $5),
                   updated_at = NOW() 
               WHERE id = $6::uuid;`,
              [
                meta.phoneticUs,
                meta.phoneticUk || meta.phoneticUs,
                meta.audioUsUrl,
                meta.audioUkUrl || meta.audioUsUrl,
                imageUrl,
                row.wordId,
              ],
            );

            logToFile(
              `SUCCESS | Term: "${term}" (${meta.pos}) | IPA: ${meta.phoneticUs || 'N/A'} | Image: ${imageUrl ? 'YES' : 'NO'} | Audio: ${meta.audioUsUrl ? 'YES' : 'NO'}`,
            );
            return true;
          } catch (dbErr: any) {
            console.error(`❌ DB Write Error for "${term}":`, dbErr.message);
            logToFile(`ERROR | Term: "${term}" - ${dbErr.message}`);
            return false;
          }
        }),
      );

      for (const res of results) {
        if (res) enrichedCount++;
        else failedCount++;
      }

      const processedSoFar = Math.min(i + BATCH_SIZE, targetRows.length);
      console.log(
        `  ⚡ Progress: [${processedSoFar}/${targetRows.length}] processed. Success: ${enrichedCount}, Failed/Skipped: ${failedCount}`,
      );
    }

    console.log(
      `\n🎉 Pipeline Complete! Log saved to backend/logs/vocabulary-enrichment.log`,
    );
    logToFile(
      `========== END ENRICHMENT SESSION | Success: ${enrichedCount}, Skipped/Failed: ${failedCount} ==========\n`,
    );
  } catch (error: any) {
    console.error('❌ Pipeline execution failed:', error);
    logToFile(`CRITICAL ERROR: ${error.message || error}`);
  } finally {
    await app.close();
  }
}

if (require.main === module) {
  const targetTerm = process.argv[2];
  enrichWordData(targetTerm)
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
