import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from '../app.module';

export async function checkVocabularyCompleteness() {
  console.log('\n📊 Auditing Vocabulary Data Completeness in Database...\n');

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });
  const dataSource = app.get(DataSource);

  try {
    // 1. Overall counts
    const totalWordsRes = await dataSource.query(
      `SELECT COUNT(*)::int AS count FROM vocab_words;`,
    );
    const totalWords: number = totalWordsRes[0]?.count || 0;

    const totalDefsRes = await dataSource.query(
      `SELECT COUNT(*)::int AS count FROM vocab_definitions;`,
    );
    const totalDefs: number = totalDefsRes[0]?.count || 0;

    const totalExamplesRes = await dataSource.query(
      `SELECT COUNT(*)::int AS count FROM vocab_examples;`,
    );
    const totalExamples: number = totalExamplesRes[0]?.count || 0;

    // 2. Missing fields in vocab_words
    const missingPhoneticsRes = await dataSource.query(
      `SELECT COUNT(*)::int AS count FROM vocab_words 
       WHERE "phoneticUs" IS NULL AND "phoneticUk" IS NULL AND phonetic IS NULL;`,
    );
    const missingPhonetics: number = missingPhoneticsRes[0]?.count || 0;

    const missingAudioRes = await dataSource.query(
      `SELECT COUNT(*)::int AS count FROM vocab_words 
       WHERE "audioUsUrl" IS NULL AND "audioUkUrl" IS NULL AND "audioUrl" IS NULL;`,
    );
    const missingAudio: number = missingAudioRes[0]?.count || 0;

    const missingImagesRes = await dataSource.query(
      `SELECT COUNT(*)::int AS count FROM vocab_words 
       WHERE "imageUrl" IS NULL OR TRIM("imageUrl") = '';`,
    );
    const missingImages: number = missingImagesRes[0]?.count || 0;

    // 3. Definitions completeness (EN and VI)
    const missingViDefsRes = await dataSource.query(
      `SELECT COUNT(*)::int AS count FROM vocab_definitions 
       WHERE definition->>'vi' IS NULL OR TRIM(definition->>'vi') = '';`,
    );
    const missingViDefs: number = missingViDefsRes[0]?.count || 0;

    const missingEnDefsRes = await dataSource.query(
      `SELECT COUNT(*)::int AS count FROM vocab_definitions 
       WHERE definition->>'en' IS NULL OR TRIM(definition->>'en') = '';`,
    );
    const missingEnDefs: number = missingEnDefsRes[0]?.count || 0;

    // 4. Words without any definition
    const wordsNoDefsRes = await dataSource.query(
      `SELECT COUNT(*)::int AS count FROM vocab_words w 
       LEFT JOIN vocab_definitions d ON d."wordId" = w.id 
       WHERE d.id IS NULL;`,
    );
    const wordsNoDefs: number = wordsNoDefsRes[0]?.count || 0;

    // 5. Words without any example sentence
    const wordsNoExamplesRes = await dataSource.query(
      `SELECT COUNT(*)::int AS count FROM vocab_words w 
       LEFT JOIN vocab_definitions d ON d."wordId" = w.id 
       LEFT JOIN vocab_examples e ON e."definitionId" = d.id 
       WHERE e.id IS NULL;`,
    );
    const wordsNoExamples: number = wordsNoExamplesRes[0]?.count || 0;

    // 6. Examples missing EN or VI sentences
    const missingViExamplesRes = await dataSource.query(
      `SELECT COUNT(*)::int AS count FROM vocab_examples 
       WHERE sentence->>'vi' IS NULL OR TRIM(sentence->>'vi') = '';`,
    );
    const missingViExamples: number = missingViExamplesRes[0]?.count || 0;

    // 7. Get top 10 sample incomplete words (if any)
    const incompleteSample: Array<{
      term: string;
      missing: string[];
    }> = [];

    const incompleteRows = await dataSource.query(
      `SELECT 
        w.term,
        w."phoneticUs",
        w."audioUsUrl",
        w."imageUrl",
        d.definition->>'vi' AS "defVi",
        e.sentence->>'en' AS "exampleEn",
        e.sentence->>'vi' AS "exampleVi"
       FROM vocab_words w
       LEFT JOIN vocab_definitions d ON d."wordId" = w.id
       LEFT JOIN vocab_examples e ON e."definitionId" = d.id
       WHERE w."phoneticUs" IS NULL
          OR w."audioUsUrl" IS NULL
          OR w."imageUrl" IS NULL
          OR d.definition->>'vi' IS NULL
          OR e.sentence->>'en' IS NULL
          OR e.sentence->>'vi' IS NULL
       LIMIT 10;`,
    );

    for (const row of incompleteRows) {
      const missing: string[] = [];
      if (!row.phoneticUs) missing.push('IPA Phonetic');
      if (!row.audioUsUrl) missing.push('Audio MP3');
      if (!row.imageUrl) missing.push('Illustration Image');
      if (!row.defVi) missing.push('VI Meaning');
      if (!row.exampleEn) missing.push('EN Example');
      if (!row.exampleVi) missing.push('VI Example');
      incompleteSample.push({ term: row.term, missing });
    }

    console.log('---------------------------------------------------------');
    console.log('   VOCABULARY DATA COMPLETENESS AUDIT REPORT           ');
    console.log('---------------------------------------------------------');
    console.log(`📌 Total Master Terms (vocab_words):   ${totalWords}`);
    console.log(`📌 Total Definitions (vocab_definitions): ${totalDefs}`);
    console.log(`📌 Total Examples (vocab_examples):      ${totalExamples}`);
    console.log('---------------------------------------------------------');
    console.log(`🔊 Missing Audio URLs:                   ${missingAudio} / ${totalWords}`);
    console.log(`🔤 Missing IPA Phonetics:               ${missingPhonetics} / ${totalWords}`);
    console.log(`🖼️  Missing Illustration Images:          ${missingImages} / ${totalWords}`);
    console.log(`🇻🇳 Missing VI Definitions:               ${missingViDefs} / ${totalDefs}`);
    console.log(`🇬🇧 Missing EN Definitions:               ${missingEnDefs} / ${totalDefs}`);
    console.log(`📝 Words without Example Sentences:      ${wordsNoExamples} / ${totalWords}`);
    console.log(`🇻🇳 Examples missing VI Translation:     ${missingViExamples} / ${totalExamples}`);
    console.log(`⚠️ Words without Definitions:            ${wordsNoDefs} / ${totalWords}`);
    console.log('---------------------------------------------------------');

    if (incompleteSample.length > 0) {
      console.log('\n⚠️ Sample Incomplete Words:');
      for (const item of incompleteSample) {
        console.log(`  - "${item.term}": Missing [${item.missing.join(', ')}]`);
      }
    } else {
      console.log('\n✅ ALL VOCABULARY WORDS ARE 100% RICH AND COMPLETE!');
    }
  } catch (error: any) {
    console.error('❌ Audit execution failed:', error.message || error);
  } finally {
    await app.close();
  }
}

if (require.main === module) {
  checkVocabularyCompleteness()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
