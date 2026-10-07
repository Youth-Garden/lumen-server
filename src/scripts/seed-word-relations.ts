import { DataSource } from 'typeorm';
import { WordRelationType } from '../contexts/vocabulary/infrastructure/entities/word-relation.entity';
import { relinkWordRelations } from './relink-word-relations';

const CURATED_RELATIONS: Record<
  string,
  { synonyms?: string[]; antonyms?: string[]; related?: string[] }
> = {
  calculation: {
    synonyms: ['computation', 'reckoning', 'estimation', 'assessment', 'forecast'],
    antonyms: ['guesswork', 'conjecture'],
    related: ['calculate', 'formula', 'math', 'figure'],
  },
  calculate: {
    synonyms: ['compute', 'figure', 'estimate', 'reckon', 'evaluate'],
    antonyms: ['guess'],
    related: ['calculation', 'calculator'],
  },
  budget: {
    synonyms: ['allowance', 'allocation', 'financial plan', 'fund'],
    antonyms: ['extravagance', 'debt'],
    related: ['finance', 'expense', 'cost', 'savings'],
  },
  strategy: {
    synonyms: ['plan', 'policy', 'tactic', 'approach', 'scheme'],
    antonyms: ['disorganization', 'improvisation'],
    related: ['strategic', 'goal', 'execution'],
  },
  schedule: {
    synonyms: ['timetable', 'program', 'agenda', 'calendar'],
    antonyms: [],
    related: ['time', 'plan', 'routine', 'slot'],
  },
  option: {
    synonyms: ['choice', 'alternative', 'selection', 'preference'],
    antonyms: ['compulsion', 'necessity'],
    related: ['optional', 'select', 'choose'],
  },
  target: {
    synonyms: ['goal', 'objective', 'aim', 'destination'],
    antonyms: [],
    related: ['focus', 'achievement', 'mark'],
  },
  analysis: {
    synonyms: ['examination', 'investigation', 'inspection', 'scrutiny'],
    antonyms: ['synthesis'],
    related: ['analyze', 'data', 'study'],
  },
  analyze: {
    synonyms: ['examine', 'inspect', 'investigate', 'evaluate', 'scrutinize'],
    antonyms: ['synthesize', 'ignore'],
    related: ['analysis', 'analytical'],
  },
  method: {
    synonyms: ['technique', 'procedure', 'system', 'process', 'manner'],
    antonyms: ['disorder'],
    related: ['methodology', 'practice'],
  },
  project: {
    synonyms: ['scheme', 'enterprise', 'venture', 'undertaking'],
    antonyms: [],
    related: ['plan', 'task', 'development'],
  },
  habit: {
    synonyms: ['routine', 'pattern', 'custom', 'practice', 'tendency'],
    antonyms: [],
    related: ['habitual', 'behavior', 'discipline'],
  },
  streak: {
    synonyms: ['run', 'sequence', 'series', 'spell'],
    antonyms: ['break', 'interruption'],
    related: ['continuous', 'daily', 'consistency'],
  },
  review: {
    synonyms: ['revision', 'assessment', 'evaluation', 'recap'],
    antonyms: ['ignore'],
    related: ['study', 'practice', 'memorize'],
  },
  performance: {
    synonyms: ['execution', 'achievement', 'fulfillment', 'output'],
    antonyms: ['failure', 'inactivity'],
    related: ['perform', 'result', 'efficiency'],
  },
  essential: {
    synonyms: ['vital', 'crucial', 'necessary', 'fundamental', 'key'],
    antonyms: ['optional', 'unnecessary', 'secondary'],
    related: ['essence', 'requirement'],
  },
  important: {
    synonyms: ['significant', 'major', 'paramount', 'meaningful'],
    antonyms: ['trivial', 'unimportant', 'minor'],
    related: ['importance', 'value'],
  },
  casual: {
    synonyms: ['relaxed', 'informal', 'easygoing', 'offhand'],
    antonyms: ['intensive', 'formal', 'serious'],
    related: ['light', 'habit'],
  },
  standard: {
    synonyms: ['regular', 'normal', 'typical', 'conventional'],
    antonyms: ['unusual', 'custom', 'extraordinary'],
    related: ['level', 'benchmark'],
  },
  accelerated: {
    synonyms: ['expedited', 'speedy', 'fast-track', 'quickened'],
    antonyms: ['delayed', 'slowed'],
    related: ['acceleration', 'speed'],
  },
  intensive: {
    synonyms: ['thorough', 'rigorous', 'deep', 'concentrated'],
    antonyms: ['superficial', 'casual'],
    related: ['intensity', 'focus'],
  },
  agreement: {
    synonyms: ['contract', 'pact', 'accord', 'settlement', 'deal'],
    antonyms: ['disagreement', 'conflict'],
    related: ['agree', 'terms'],
  },
  negotiation: {
    synonyms: ['bargaining', 'discussion', 'dialogue', 'consultation'],
    antonyms: [],
    related: ['negotiate', 'terms'],
  },
  market: {
    synonyms: ['bazaar', 'marketplace', 'trade', 'commerce'],
    antonyms: [],
    related: ['marketing', 'commercial'],
  },
  contract: {
    synonyms: ['agreement', 'covenant', 'pact', 'treaty'],
    antonyms: [],
    related: ['legal', 'terms', 'binding'],
  },
  expand: {
    synonyms: ['enlarge', 'extend', 'broaden', 'develop', 'grow'],
    antonyms: ['contract', 'shrink', 'reduce'],
    related: ['expansion', 'expansive'],
  },
  customer: {
    synonyms: ['client', 'buyer', 'patron', 'purchaser', 'consumer'],
    antonyms: ['seller', 'vendor'],
    related: ['service', 'sales'],
  },
};

export async function seedWordRelations(dataSource: DataSource): Promise<number> {
  console.log('--- Starting Lexical Relations Seeding ---');

  const rows: Array<{
    wordId: string;
    term: string;
    defId: string | null;
  }> = await dataSource.query(`
    SELECT w.id AS "wordId", LOWER(w.term) AS term, d.id AS "defId"
    FROM vocab_words w
    LEFT JOIN vocab_definitions d ON d."wordId" = w.id
  `);

  let count = 0;

  for (const row of rows) {
    const rels = CURATED_RELATIONS[row.term];
    if (!rels) continue;

    // 1. Synonyms
    if (rels.synonyms && rels.synonyms.length > 0 && row.defId) {
      for (let i = 0; i < rels.synonyms.length; i++) {
        const targetTerm = rels.synonyms[i];
        await dataSource.query(
          `INSERT INTO vocab_word_relations (id, "sourceWordId", "definitionId", "targetTerm", "relationType", "displayOrder", created_at, updated_at)
           VALUES (gen_random_uuid(), $1::uuid, $2::uuid, $3, $4, $5, NOW(), NOW())
           ON CONFLICT DO NOTHING;`,
          [
            row.wordId,
            row.defId,
            targetTerm,
            WordRelationType.SYNONYM,
            i,
          ],
        );
        count++;
      }
    }

    // 2. Antonyms
    if (rels.antonyms && rels.antonyms.length > 0 && row.defId) {
      for (let i = 0; i < rels.antonyms.length; i++) {
        const targetTerm = rels.antonyms[i];
        await dataSource.query(
          `INSERT INTO vocab_word_relations (id, "sourceWordId", "definitionId", "targetTerm", "relationType", "displayOrder", created_at, updated_at)
           VALUES (gen_random_uuid(), $1::uuid, $2::uuid, $3, $4, $5, NOW(), NOW())
           ON CONFLICT DO NOTHING;`,
          [
            row.wordId,
            row.defId,
            targetTerm,
            WordRelationType.ANTONYM,
            i,
          ],
        );
        count++;
      }
    }

    // 3. Related Words (Word-level)
    if (rels.related && rels.related.length > 0) {
      for (let i = 0; i < rels.related.length; i++) {
        const targetTerm = rels.related[i];
        await dataSource.query(
          `INSERT INTO vocab_word_relations (id, "sourceWordId", "definitionId", "targetTerm", "relationType", "displayOrder", created_at, updated_at)
           VALUES (gen_random_uuid(), $1::uuid, NULL, $2, $3, $4, NOW(), NOW())
           ON CONFLICT DO NOTHING;`,
          [
            row.wordId,
            targetTerm,
            WordRelationType.RELATED,
            i,
          ],
        );
        count++;
      }
    }
  }

  // Relink targetWordId for matching terms in DB
  const relinkedCount = await relinkWordRelations(dataSource);
  console.log(
    `✅ Seeded ${count} word relations and relinked ${relinkedCount} target word IDs.`,
  );

  return count;
}
