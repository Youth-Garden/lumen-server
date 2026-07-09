import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListeningSpeakingController } from './presentation/http/listening-speaking.controller';
import { ListeningLessonEntity } from './infrastructure/entities/listening-lesson.entity';
import { SpeakingTaskEntity } from './infrastructure/entities/speaking-task.entity';
import { SpeechRecordEntity } from './infrastructure/entities/speech-record.entity';
import { LISTENING_LESSON_REPOSITORY } from './domain/repositories/listening-lesson.repository.interface';
import { ListeningLessonRepository } from './infrastructure/repositories/listening-lesson.repository';
import { SPEAKING_TASK_REPOSITORY } from './domain/repositories/speaking-task.repository.interface';
import { SpeakingTaskRepository } from './infrastructure/repositories/speaking-task.repository';
import { SPEECH_RECORD_REPOSITORY } from './domain/repositories/speech-record.repository.interface';
import { SpeechRecordRepository } from './infrastructure/repositories/speech-record.repository';
import { CreateListeningLessonHandler } from './application/commands/create-listening-lesson.handler';
import { CreateSpeakingTaskHandler } from './application/commands/create-speaking-task.handler';
import { SubmitSpeechRecordHandler } from './application/commands/submit-speech-record.handler';
import { ListListeningLessonsHandler } from './application/queries/list-listening-lessons.handler';
import { GetListeningLessonDetailsHandler } from './application/queries/get-listening-lesson-details.handler';
import { ListSpeakingTasksHandler } from './application/queries/list-speaking-tasks.handler';

const CommandHandlers = [
  CreateListeningLessonHandler,
  CreateSpeakingTaskHandler,
  SubmitSpeechRecordHandler,
];
const QueryHandlers = [
  ListListeningLessonsHandler,
  GetListeningLessonDetailsHandler,
  ListSpeakingTasksHandler,
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      ListeningLessonEntity,
      SpeakingTaskEntity,
      SpeechRecordEntity,
    ]),
  ],
  controllers: [ListeningSpeakingController],
  providers: [
    {
      provide: LISTENING_LESSON_REPOSITORY,
      useClass: ListeningLessonRepository,
    },
    {
      provide: SPEAKING_TASK_REPOSITORY,
      useClass: SpeakingTaskRepository,
    },
    {
      provide: SPEECH_RECORD_REPOSITORY,
      useClass: SpeechRecordRepository,
    },
    ...CommandHandlers,
    ...QueryHandlers,
  ],
})
export class ListeningSpeakingModule {}
