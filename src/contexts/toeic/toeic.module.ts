import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ToeicTestEntity } from './infrastructure/entities/toeic-test.entity';
import { ToeicQuestionEntity } from './infrastructure/entities/toeic-question.entity';
import { UserNoteEntity } from './infrastructure/entities/user-note.entity';
import { ToeicController } from './presentation/http/toeic.controller';
import { ListToeicTestsHandler } from './application/queries/list-toeic-tests.query';
import { GetToeicTestByIdHandler } from './application/queries/get-toeic-test-by-id.query';
import { GetUserNotesHandler } from './application/queries/get-user-notes.handler';
import { GetQuestionsWithoutExplanationHandler } from './application/queries/get-questions-without-explanation.handler';
import { SaveUserNoteHandler } from './application/commands/save-user-note.handler';
import { UpdateExplanationHandler } from './application/commands/update-explanation.handler';
import { CreateToeicTestHandler } from './application/commands/create-toeic-test.handler';
import { UpdateToeicTestHandler } from './application/commands/update-toeic-test.handler';
import { DeleteToeicTestHandler } from './application/commands/delete-toeic-test.handler';
import { PublishToeicTestHandler } from './application/commands/publish-toeic-test.handler';
import { TOEIC_QUERY_REPOSITORY } from './application/ports/toeic-query.repository';
import { ToeicQueryRepository } from './infrastructure/repositories/toeic-query.repository';

const queryHandlers = [
  ListToeicTestsHandler,
  GetToeicTestByIdHandler,
  GetUserNotesHandler,
  GetQuestionsWithoutExplanationHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ToeicTestEntity,
      ToeicQuestionEntity,
      UserNoteEntity,
    ]),
    CqrsModule,
  ],
  controllers: [ToeicController],
  providers: [
    ...queryHandlers,
    SaveUserNoteHandler,
    UpdateExplanationHandler,
    CreateToeicTestHandler,
    UpdateToeicTestHandler,
    DeleteToeicTestHandler,
    PublishToeicTestHandler,
    {
      provide: TOEIC_QUERY_REPOSITORY,
      useClass: ToeicQueryRepository,
    },
  ],
})
export class ToeicModule {}
