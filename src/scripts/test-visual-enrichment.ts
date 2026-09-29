import * as dotenv from 'dotenv';
dotenv.config();

import {
  VocabularyEnricherService,
  resolveVisualSearchQuery,
} from '../shared/infrastructure/enrichment/index';

const TEST_TERMS = [
  // Abstract Words / Adjectives / Adverbs
  'frequent',
  'frequently',
  'habitual',
  'however',
  'strategy',
  'analysis',
  'negotiate',
  'concept',
  'opportunity',

  // Concrete Nouns
  'guitar',
  'bookstore',
  'gym',
  'airplane',
  'cat',
];

async function runTest() {
  console.log('🚀 Starting Visual Query & Image Retrieval Test...\n');
  const enricher = new VocabularyEnricherService();

  const results: Array<{
    term: string;
    resolvedQuery: string;
    imageUrl: string | null;
    definitionVi: string;
  }> = [];

  for (const term of TEST_TERMS) {
    console.log(`🔍 Processing term: "${term}"...`);
    try {
      const enriched = await enricher.enrichFullWord(term);
      const resolvedQuery = resolveVisualSearchQuery(
        term,
        enriched.partOfSpeech,
        enriched.definitionEn,
      );

      results.push({
        term: enriched.term,
        resolvedQuery,
        imageUrl: enriched.imageUrl,
        definitionVi: enriched.definitionVi,
      });
      console.log(`   └─► Visual Query: "${resolvedQuery}"`);
      console.log(`   └─► Image URL: ${enriched.imageUrl}`);
      console.log(`   └─► Def VI: "${enriched.definitionVi}"\n`);
    } catch (err) {
      console.error(`   ❌ Failed for "${term}":`, err);
    }
  }

  console.log('====================================================');
  console.log('📋 SUMMARY RESULTS FOR MANUAL EVALUATION:');
  console.log('====================================================\n');
  results.forEach((r, idx) => {
    console.log(`${idx + 1}. [${r.term.toUpperCase()}]`);
    console.log(`   - Resolved Search Query: "${r.resolvedQuery}"`);
    console.log(`   - Definition (VI): ${r.definitionVi}`);
    console.log(`   - Image URL: ${r.imageUrl || 'N/A'}\n`);
  });
}

runTest().catch(console.error);
