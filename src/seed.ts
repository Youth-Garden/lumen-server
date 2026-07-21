/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import { GrammarExerciseEntity } from './contexts/grammar/infrastructure/entities/grammar-exercise.entity';
import { GrammarLessonEntity } from './contexts/grammar/infrastructure/entities/grammar-lesson.entity';
import { GrammarTopicEntity } from './contexts/grammar/infrastructure/entities/grammar-topic.entity';
import { UserEntity } from './contexts/iam/infrastructure/entities/user.entity';
import { ListeningLessonEntity } from './contexts/listening-speaking/infrastructure/entities/listening-lesson.entity';
import { SpeakingTaskEntity } from './contexts/listening-speaking/infrastructure/entities/speaking-task.entity';
import { SpeechRecordEntity } from './contexts/listening-speaking/infrastructure/entities/speech-record.entity';
import { MaterialEntity } from './contexts/material/infrastructure/entities/material.entity';
import { TranscriptEntity } from './contexts/material/infrastructure/entities/transcript.entity';
import { ActivityEntity } from './contexts/progress/infrastructure/entities/activity.entity';
import { BadgeEntity } from './contexts/progress/infrastructure/entities/badge.entity';
import { LearningProfileEntity } from './contexts/progress/infrastructure/entities/learning-profile.entity';
import { QuestionEntity as QuizQuestionEntity } from './contexts/quiz/infrastructure/entities/question.entity';
import { QuizEntity } from './contexts/quiz/infrastructure/entities/quiz.entity';
import { ArticleEntity } from './contexts/reading/infrastructure/entities/article.entity';
import { ToeicQuestionEntity } from './contexts/toeic/infrastructure/entities/toeic-question.entity';
import { ToeicTestEntity } from './contexts/toeic/infrastructure/entities/toeic-test.entity';
import { DeckEntity } from './contexts/vocabulary/infrastructure/entities/deck.entity';
import { DefinitionEntity } from './contexts/vocabulary/infrastructure/entities/definition.entity';
import { ExampleEntity } from './contexts/vocabulary/infrastructure/entities/example.entity';
import { FlashcardEntity } from './contexts/vocabulary/infrastructure/entities/flashcard.entity';
import { WordEntity } from './contexts/vocabulary/infrastructure/entities/word.entity';
import { badgeData } from './seed/badge-data';
import { grammarData } from './seed/grammar-data';
import { materialMockData } from './seed/material-data';
import { progressData } from './seed/progress-data';
import { quizMockData } from './seed/quiz-data';
import { articleData } from './seed/reading-data';
import { listeningLessonData, speakingTaskData } from './seed/speaking-data';
import { toeicMockData } from './seed/toeic-data';
import { userData } from './seed/user-data';
import { deckData } from './seed/vocabulary-data';

// Dynamic load generated datasets from data-generator output if available
const genDictationPath = path.join(
  process.cwd(),
  '../data-generator/output/dictation-data.json',
);
const genReadingPath = path.join(
  process.cwd(),
  '../data-generator/output/reading-data.json',
);
const genVocabPath = path.join(
  process.cwd(),
  '../data-generator/output/vocab-data.json',
);

const activeMaterialData = fs.existsSync(genDictationPath)
  ? JSON.parse(fs.readFileSync(genDictationPath, 'utf8'))
  : materialMockData;

const activeArticleData = fs.existsSync(genReadingPath)
  ? JSON.parse(fs.readFileSync(genReadingPath, 'utf8'))
  : articleData;

const activeDeckData = fs.existsSync(genVocabPath)
  ? JSON.parse(fs.readFileSync(genVocabPath, 'utf8'))
  : deckData;

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
  const quizRepo = dataSource.getRepository(QuizEntity);
  const quizQuestionRepo = dataSource.getRepository(QuizQuestionEntity);
  const badgeRepo = dataSource.getRepository(BadgeEntity);
  const learningProfileRepo = dataSource.getRepository(LearningProfileEntity);
  const activityRepo = dataSource.getRepository(ActivityEntity);
  const grammarTopicRepo = dataSource.getRepository(GrammarTopicEntity);
  const grammarLessonRepo = dataSource.getRepository(GrammarLessonEntity);
  const grammarExerciseRepo = dataSource.getRepository(GrammarExerciseEntity);
  const listeningLessonRepo = dataSource.getRepository(ListeningLessonEntity);
  const speakingTaskRepo = dataSource.getRepository(SpeakingTaskEntity);
  const speechRecordRepo = dataSource.getRepository(SpeechRecordEntity);

  console.log('--- Starting System Database Seeding ---');
  await badgeRepo.createQueryBuilder().delete().execute();
  const badgesToSave = badgeData.map((def) => {
    const b = new BadgeEntity();
    b.code = def.code;
    b.name = def.name;
    b.description = def.description;
    b.icon = def.icon;
    return b;
  });
  await badgeRepo.save(badgesToSave);
  console.log(`Seeded ${badgesToSave.length} Badges.`);

  console.log('--- Starting System Database Seeding ---');

  // Clear existing data
  await grammarExerciseRepo.createQueryBuilder().delete().execute();
  await grammarLessonRepo.createQueryBuilder().delete().execute();
  await grammarTopicRepo.createQueryBuilder().delete().execute();
  await speechRecordRepo.createQueryBuilder().delete().execute();
  await speakingTaskRepo.createQueryBuilder().delete().execute();
  await listeningLessonRepo.createQueryBuilder().delete().execute();
  await activityRepo.createQueryBuilder().delete().execute();
  await learningProfileRepo.createQueryBuilder().delete().execute();

  await flashcardRepo.createQueryBuilder().delete().execute();
  await exampleRepo.createQueryBuilder().delete().execute();
  await definitionRepo.createQueryBuilder().delete().execute();
  await wordRepo.createQueryBuilder().delete().execute();
  await deckRepo.createQueryBuilder().delete().execute();
  await quizQuestionRepo.createQueryBuilder().delete().execute();
  await quizRepo.createQueryBuilder().delete().execute();
  await articleRepo.createQueryBuilder().delete().execute();
  await transcriptRepo.createQueryBuilder().delete().execute();
  await materialRepo.createQueryBuilder().delete().execute();
  await questionRepo.createQueryBuilder().delete().execute();
  await testRepo.createQueryBuilder().delete().execute();
  await dataSource.query('DELETE FROM "iam_sessions"');
  await userRepo.createQueryBuilder().delete().execute();
  console.log('Cleared existing data.');

  console.log('--- Starting User Database Seeding ---');
  let targetUserId: string = '';
  for (const userDataItem of userData) {
    const user = new UserEntity();
    user.email = userDataItem.email;
    user.fullName = userDataItem.fullName;
    user.role =
      userDataItem.role as unknown as import('./contexts/iam/domain/enums/role.enum').Role;
    const savedUser = await userRepo.save(user);
    if (user.email === 'student@lumen.com') {
      targetUserId = savedUser.id;
    } else if (!targetUserId && user.email === 'user@lumen.com') {
      targetUserId = savedUser.id; // fallback
    }
    console.log(`Created User: ${savedUser.email}`);
  }

  for (const testData of toeicMockData) {
    const test = new ToeicTestEntity();
    test.title = testData.title;
    test.description = testData.description;
    test.isPublished = testData.isPublished;

    const savedTest = await testRepo.save(test);
    console.log(`Created Test: ${savedTest.title}`);

    const questionsToSave = [];
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
      question.explanation = {
        en: questionData.explanation || '',
        vi:
          ('translation' in questionData
            ? (questionData as { translation?: string }).translation
            : '') || '',
      };

      questionsToSave.push(question);
    }
    await questionRepo.save(questionsToSave);
    console.log(
      `Created ${questionsToSave.length} questions for ${savedTest.title}`,
    );
  }

  console.log('--- Starting Grammar Database Seeding ---');
  for (const topicData of grammarData) {
    const topic = new GrammarTopicEntity();
    topic.title = topicData.title;
    topic.description = topicData.description;
    topic.cefrLevel = topicData.cefrLevel;
    topic.category = topicData.category ?? null;
    const savedTopic = await grammarTopicRepo.save(topic);

    for (const lessonData of topicData.lessons) {
      const lesson = new GrammarLessonEntity();
      lesson.topicId = savedTopic.id;
      lesson.title = lessonData.title;
      lesson.content = lessonData.content;
      lesson.orderIndex = lessonData.orderIndex;
      const savedLesson = await grammarLessonRepo.save(lesson);

      for (const exData of lessonData.exercises) {
        const exercise = new GrammarExerciseEntity();
        exercise.lessonId = savedLesson.id;
        exercise.questionText = exData.questionText;
        exercise.options = exData.options;
        exercise.correctAnswer = exData.correctAnswer;
        exercise.explanation = exData.explanation;
        await grammarExerciseRepo.save(exercise);
      }
    }
    console.log(`Created Grammar Topic: ${savedTopic.title}`);
  }

  console.log('--- Starting Listening-Speaking Database Seeding ---');
  for (const taskData of speakingTaskData) {
    const task = new SpeakingTaskEntity();
    task.title = taskData.title;
    task.prompt = taskData.prompt;
    task.referenceAudioUrl = taskData.referenceAudioUrl;
    task.keywords = taskData.keywords;
    task.category = taskData.category ?? null;
    await speakingTaskRepo.save(task);
    console.log(`Created Speaking Task: ${task.title}`);
  }

  for (const lessonData of listeningLessonData) {
    const lesson = new ListeningLessonEntity();
    lesson.title = lessonData.title;
    lesson.audioUrl = lessonData.audioUrl;
    lesson.cefrLevel = lessonData.cefrLevel;
    lesson.transcript = lessonData.transcript.map((t) => ({
      startTime: t.startTime,
      endTime: t.endTime,
      text: { en: t.text, vi: t.translation },
    }));
    await listeningLessonRepo.save(lesson);
    console.log(`Created Listening Lesson: ${lesson.title}`);
  }

  console.log('--- Starting Material (Dictation) Database Seeding ---');
  for (const materialData of activeMaterialData) {
    const material = new MaterialEntity();
    material.title = materialData.title;
    material.description = materialData.description;
    material.type =
      materialData.type === 'PODCAST' ? 'AUDIO' : materialData.type;

    let level = materialData.level;
    if (level === 'BEGINNER') level = 'A1';
    if (level === 'INTERMEDIATE') level = 'B1';
    if (level === 'ADVANCED') level = 'C1';
    material.level = level;

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
  for (const deckDataItem of activeDeckData) {
    const deck = new DeckEntity();
    deck.name = deckDataItem.name;
    deck.description = deckDataItem.description;
    deck.authorId = targetUserId;

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
      definition.definition = { en: wordData.definition };
      const savedDef = await definitionRepo.save(definition);

      const example = new ExampleEntity();
      example.definitionId = savedDef.id;
      example.sentence = { en: wordData.example };
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
  for (const articleDataItem of activeArticleData) {
    const article = new ArticleEntity();
    article.title = articleDataItem.title;
    article.content = articleDataItem.content;
    article.userId = targetUserId;

    const savedArticle = await articleRepo.save(article);
    console.log(`Created Article: ${savedArticle.title}`);
  }

  console.log('--- Starting Quiz Database Seeding ---');
  const savedWords = await wordRepo.find({ take: 100 }); // fetch more words to use
  if (savedWords.length >= 20) {
    let wordIndex = 0;

    for (const quizData of quizMockData) {
      const quiz = new QuizEntity();
      quiz.userId = targetUserId;
      quiz.status = quizData.status;
      quiz.score = quizData.score;

      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - quizData.daysAgo);
      quiz.createdAt = pastDate;
      if (quizData.status === 'COMPLETED') {
        quiz.completedAt = pastDate;
      }
      const savedQuiz = await quizRepo.save(quiz);

      for (let i = 0; i < quizData.questionsCount; i++) {
        // Wrap around wordIndex if we run out of words
        const word = savedWords[wordIndex % savedWords.length];
        wordIndex++;

        const q = new QuizQuestionEntity();
        q.quizId = savedQuiz.id;
        q.wordId = word.id;
        q.type = 'MULTIPLE_CHOICE';
        q.questionText = `What is the correct definition for "${word.term}"?`;
        q.options = ['Option A', 'Option B', 'Option C', 'Option D'];
        q.correctAnswer = 'Option A';

        if (quizData.status === 'COMPLETED') {
          // Fill user answers to match correctCount
          const isCorrect = i < quizData.correctCount;
          q.userAnswer = isCorrect ? 'Option A' : 'Option B';
          q.isCorrect = isCorrect;
        }
        await quizQuestionRepo.save(q);
      }
      console.log(
        `Created Quiz (Status: ${quizData.status}, Score: ${quizData.score}): ${savedQuiz.id}`,
      );
    }
  }

  console.log('--- Starting Progress Database Seeding ---');
  if (targetUserId) {
    const profile = new LearningProfileEntity();
    profile.userId = targetUserId;
    profile.streak = progressData.learningProfile.streak;
    profile.totalPoints = progressData.learningProfile.totalPoints;
    profile.dailyGoalMinutes = progressData.learningProfile.dailyGoalMinutes;
    profile.unlockedBadges = progressData.learningProfile.unlockedBadges;
    profile.streakFreezes = progressData.learningProfile.streakFreezes;
    profile.lastActivityDate = progressData.learningProfile.lastActivityDate;
    await learningProfileRepo.save(profile);
    console.log(`Created Learning Profile for target user.`);

    let delay = 0;
    for (const act of progressData.activities) {
      const activity = new ActivityEntity();
      activity.userId = targetUserId;
      activity.type = act.type;
      activity.title = act.title;
      activity.description = act.description;
      activity.xpEarned = act.xpEarned;
      activity.durationMinutes = act.durationMinutes;
      const timestamp = new Date(Date.now() - delay);
      delay += 3600000; // minus 1 hour for each activity to show timeline
      activity.timestamp = timestamp;
      await activityRepo.save(activity);
    }
    console.log(
      `Created ${progressData.activities.length} activities for target user.`,
    );
  }

  console.log('--- Seeding Completed Successfully ---');
  await app.close();
}

bootstrap().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
