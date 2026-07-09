import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { ToeicTestEntity } from './contexts/toeic/infrastructure/entities/toeic-test.entity';
import { ToeicQuestionEntity } from './contexts/toeic/infrastructure/entities/toeic-question.entity';
import { MaterialEntity } from './contexts/material/infrastructure/entities/material.entity';
import { TranscriptEntity } from './contexts/material/infrastructure/entities/transcript.entity';
import { UserEntity } from './contexts/iam/infrastructure/entities/user.entity';
import { DeckEntity } from './contexts/vocabulary/infrastructure/entities/deck.entity';
import { WordEntity } from './contexts/vocabulary/infrastructure/entities/word.entity';
import { DefinitionEntity } from './contexts/vocabulary/infrastructure/entities/definition.entity';
import { ExampleEntity } from './contexts/vocabulary/infrastructure/entities/example.entity';
import { FlashcardEntity } from './contexts/vocabulary/infrastructure/entities/flashcard.entity';
import { ArticleEntity } from './contexts/reading/infrastructure/entities/article.entity';
import { toeicMockData } from './seed/toeic-data';
import { materialMockData } from './seed/material-data';
import { userData } from './seed/user-data';
import { deckData } from './seed/vocabulary-data';
import { articleData } from './seed/reading-data';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const testRepo = dataSource.getRepository(ToeicTestEntity);
  const questionRepo = dataSource.getRepository(ToeicQuestionEntity);
  const materialRepo = dataSource.getRepository(MaterialEntity);
  const transcriptRepo = dataSource.getRepository(TranscriptEntity);
  const userRepo = dataSource.getRepository(UserEntity);
  const deckRepo = dataSource.getRepository(DeckEntity);
  const wordRepo = dataSource.getRepository(WordEntity);
  const definitionRepo = dataSource.getRepository(DefinitionEntity);
  const exampleRepo = dataSource.getRepository(ExampleEntity);
  const flashcardRepo = dataSource.getRepository(FlashcardEntity);
  const articleRepo = dataSource.getRepository(ArticleEntity);

  console.log('--- Starting TOEIC Database Seeding ---');

  // Clear existing data
  await flashcardRepo.createQueryBuilder().delete().execute();
  await exampleRepo.createQueryBuilder().delete().execute();
  await definitionRepo.createQueryBuilder().delete().execute();
  await wordRepo.createQueryBuilder().delete().execute();
  await deckRepo.createQueryBuilder().delete().execute();
  await articleRepo.createQueryBuilder().delete().execute();
  await transcriptRepo.createQueryBuilder().delete().execute();
  await materialRepo.createQueryBuilder().delete().execute();
  await questionRepo.createQueryBuilder().delete().execute();
  await testRepo.createQueryBuilder().delete().execute();
  await userRepo.createQueryBuilder().delete().execute();
  console.log('Cleared existing data.');

  console.log('--- Starting User Database Seeding ---');
  let firstUserId: string = '';
  for (const userDataItem of userData) {
    const user = new UserEntity();
    user.email = userDataItem.email;
    user.password = userDataItem.password; // Note: In a real app, this should be hashed. Seed is for testing.
    user.fullName = userDataItem.fullName;
    user.role =
      userDataItem.role as unknown as import('./contexts/iam/domain/enums/role.enum').Role;
    const savedUser = await userRepo.save(user);
    if (!firstUserId) firstUserId = savedUser.id;
    console.log(`Created User: ${savedUser.email}`);
  }

  for (const testData of toeicMockData) {
    const test = new ToeicTestEntity();
    test.title = testData.title;
    test.description = testData.description;
    test.isPublished = testData.isPublished;

    const savedTest = await testRepo.save(test);
    console.log(`Created Test: ${savedTest.title}`);

    for (const questionData of testData.questions) {
      const question = new ToeicQuestionEntity();
      question.testId = savedTest.id;
      question.part = questionData.part;
      question.questionNumber = questionData.questionNumber;
      question.audioUrl = questionData.audioUrl || '';
      question.imageUrl = questionData.imageUrl || '';
      question.transcript = questionData.transcript || '';
      question.questionText = questionData.questionText || '';
      question.options = questionData.options || [];
      question.correctAnswer = questionData.correctAnswer || '';
      question.explanation = questionData.explanation || '';

      await questionRepo.save(question);
    }
    console.log(
      `Created ${testData.questions.length} questions for ${savedTest.title}`,
    );
  }

  console.log('--- Starting Material (Dictation) Database Seeding ---');
  for (const materialData of materialMockData) {
    const material = new MaterialEntity();
    material.title = materialData.title;
    material.description = materialData.description;
    material.type = materialData.type;
    material.level = materialData.level;
    material.mediaUrl = materialData.mediaUrl;
    material.thumbnailUrl = materialData.thumbnailUrl;
    material.tags = materialData.tags;
    material.duration = materialData.duration;

    const savedMaterial = await materialRepo.save(material);
    console.log(`Created Material: ${savedMaterial.title}`);

    for (const transcriptData of materialData.transcripts) {
      const transcript = new TranscriptEntity();
      transcript.materialId = savedMaterial.id;
      transcript.sequenceNumber = transcriptData.sequenceNumber;
      transcript.text = transcriptData.text;
      transcript.translation = transcriptData.translation;
      transcript.startTime = transcriptData.startTime;
      transcript.endTime = transcriptData.endTime;

      await transcriptRepo.save(transcript);
    }
    console.log(
      `Created ${materialData.transcripts.length} transcripts for ${savedMaterial.title}`,
    );
  }

  console.log('--- Starting Vocabulary Database Seeding ---');
  for (const deckDataItem of deckData) {
    const deck = new DeckEntity();
    deck.name = deckDataItem.name;
    deck.description = deckDataItem.description;
    deck.authorId = firstUserId;

    const savedDeck = await deckRepo.save(deck);
    console.log(`Created Deck: ${savedDeck.name}`);

    for (const wordData of deckDataItem.words) {
      const word = new WordEntity();
      word.term = wordData.term;
      word.phonetic = wordData.phonetic;
      word.cefrLevel = wordData.cefrLevel;
      const savedWord = await wordRepo.save(word);

      const definition = new DefinitionEntity();
      definition.wordId = savedWord.id;
      definition.partOfSpeech = wordData.partOfSpeech;
      definition.definitionEn = wordData.definition;
      definition.translationVi = wordData.translationVi;
      const savedDef = await definitionRepo.save(definition);

      const example = new ExampleEntity();
      example.definitionId = savedDef.id;
      example.sentenceEn = wordData.example;
      example.translationVi = wordData.exampleTranslation;
      await exampleRepo.save(example);

      const flashcard = new FlashcardEntity();
      flashcard.deckId = savedDeck.id;
      flashcard.wordId = savedWord.id;
      await flashcardRepo.save(flashcard);
    }
    console.log(
      `Created ${deckDataItem.words.length} words for ${savedDeck.name}`,
    );
  }

  console.log('--- Starting Reading Database Seeding ---');
  for (const articleDataItem of articleData) {
    const article = new ArticleEntity();
    article.title = articleDataItem.title;
    article.content = articleDataItem.content;
    article.userId = firstUserId;

    const savedArticle = await articleRepo.save(article);
    console.log(`Created Article: ${savedArticle.title}`);
  }

  console.log('--- Seeding Completed Successfully ---');
  await app.close();
}

bootstrap().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
