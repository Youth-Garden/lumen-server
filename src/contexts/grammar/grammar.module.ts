import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrammarTopicEntity } from './infrastructure/typeorm/entities/grammar-topic.entity';
import { GrammarLessonEntity } from './infrastructure/typeorm/entities/grammar-lesson.entity';
import { GrammarExerciseEntity } from './infrastructure/typeorm/entities/grammar-exercise.entity';
import { GrammarTopicRepository } from './infrastructure/typeorm/repositories/grammar-topic.repository';
import { GrammarExerciseRepository } from './infrastructure/typeorm/repositories/grammar-exercise.repository';
import { GRAMMAR_TOPIC_REPOSITORY } from './domain/repositories/grammar-topic.repository.interface';
import { GRAMMAR_EXERCISE_REPOSITORY } from './domain/repositories/grammar-exercise.repository.interface';
import { CreateGrammarTopicHandler } from './application/commands/create-grammar-topic.handler';
import { AddGrammarLessonHandler } from './application/commands/add-grammar-lesson.handler';
import { AddGrammarExerciseHandler } from './application/commands/add-grammar-exercise.handler';
import { SubmitGrammarExerciseHandler } from './application/commands/submit-grammar-exercise.handler';
import { ListGrammarTopicsHandler } from './application/queries/list-grammar-topics.handler';
import { GetGrammarTopicDetailsHandler } from './application/queries/get-grammar-topic-details.handler';
import { ListGrammarLessonExercisesHandler } from './application/queries/list-grammar-lesson-exercises.handler';
import { GrammarController } from './presentation/http/grammar.controller';

const CommandHandlers = [
  CreateGrammarTopicHandler,
  AddGrammarLessonHandler,
  AddGrammarExerciseHandler,
  SubmitGrammarExerciseHandler,
];

const QueryHandlers = [
  ListGrammarTopicsHandler,
  GetGrammarTopicDetailsHandler,
  ListGrammarLessonExercisesHandler,
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      GrammarTopicEntity,
      GrammarLessonEntity,
      GrammarExerciseEntity,
    ]),
  ],
  controllers: [GrammarController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: GRAMMAR_TOPIC_REPOSITORY,
      useClass: GrammarTopicRepository,
    },
    {
      provide: GRAMMAR_EXERCISE_REPOSITORY,
      useClass: GrammarExerciseRepository,
    },
  ],
})
export class GrammarModule {}
