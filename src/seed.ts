/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import { UserEntity } from './contexts/iam/infrastructure/entities/user.entity';
import { MaterialEntity } from './contexts/material/infrastructure/entities/material.entity';
import { TranscriptEntity } from './contexts/material/infrastructure/entities/transcript.entity';
import { ActivityEntity } from './contexts/progress/infrastructure/entities/activity.entity';
import { BadgeEntity } from './contexts/progress/infrastructure/entities/badge.entity';
import { LearningProfileEntity } from './contexts/progress/infrastructure/entities/learning-profile.entity';
import { DeckEntity } from './contexts/vocabulary/infrastructure/entities/deck.entity';
import { DefinitionEntity } from './contexts/vocabulary/infrastructure/entities/definition.entity';
import { ExampleEntity } from './contexts/vocabulary/infrastructure/entities/example.entity';
import { FlashcardEntity } from './contexts/vocabulary/infrastructure/entities/flashcard.entity';
import { WordEntity } from './contexts/vocabulary/infrastructure/entities/word.entity';
import { badgeData } from './seed/badge-data';
import { materialMockData } from './seed/material-data';
import { progressData } from './seed/progress-data';
import { userData } from './seed/user-data';
import { deckData } from './seed/vocabulary-data';
import { seedToeicVocabulary } from './seed-toeic';
import { StorageService } from './shared/infrastructure/storage/storage.service';

const genDictationPath = path.join(
  process.cwd(),
  '../data-generator/output/dictation-data.json',
);
const genVocabPath = path.join(
  process.cwd(),
  '../data-generator/output/vocab-data.json',
);

const activeMaterialData = fs.existsSync(genDictationPath)
  ? JSON.parse(fs.readFileSync(genDictationPath, 'utf8'))
  : materialMockData;

const activeDeckData = fs.existsSync(genVocabPath)
  ? JSON.parse(fs.readFileSync(genVocabPath, 'utf8'))
  : deckData;

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const materialRepo = dataSource.getRepository(MaterialEntity);
  const transcriptRepo = dataSource.getRepository(TranscriptEntity);
  const userRepo = dataSource.getRepository(UserEntity);
  const deckRepo = dataSource.getRepository(DeckEntity);
  const wordRepo = dataSource.getRepository(WordEntity);
  const definitionRepo = dataSource.getRepository(DefinitionEntity);
  const exampleRepo = dataSource.getRepository(ExampleEntity);
  const flashcardRepo = dataSource.getRepository(FlashcardEntity);
  const badgeRepo = dataSource.getRepository(BadgeEntity);
  const learningProfileRepo = dataSource.getRepository(LearningProfileEntity);
  const activityRepo = dataSource.getRepository(ActivityEntity);

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

  // Clear existing data
  await activityRepo.createQueryBuilder().delete().execute();
  await learningProfileRepo.createQueryBuilder().delete().execute();

  await flashcardRepo.createQueryBuilder().delete().execute();
  await exampleRepo.createQueryBuilder().delete().execute();
  await definitionRepo.createQueryBuilder().delete().execute();
  await wordRepo.createQueryBuilder().delete().execute();
  await deckRepo.createQueryBuilder().delete().execute();
  await transcriptRepo.createQueryBuilder().delete().execute();
  await materialRepo.createQueryBuilder().delete().execute();
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

  console.log('--- Starting Material Database Seeding ---');
  const storageService = app.get(StorageService);
  const audioDir = path.join(process.cwd(), '../data-generator/output/audio');
  const audioUrlMap = await storageService.uploadAudioDirectory(audioDir);

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

    const rawMediaUrl = String(materialData.mediaUrl || '');
    const fileName = path.basename(rawMediaUrl);
    material.mediaUrl = audioUrlMap[fileName] || rawMediaUrl;
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
  await seedToeicVocabulary(dataSource);

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
      delay += 3600000;
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
