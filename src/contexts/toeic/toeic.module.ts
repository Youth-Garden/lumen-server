import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ToeicTestEntity } from './infrastructure/entities/toeic-test.entity';
import { ToeicQuestionEntity } from './infrastructure/entities/toeic-question.entity';
import { ToeicController } from './presentation/http/toeic.controller';
import { ListToeicTestsHandler } from './application/queries/list-toeic-tests.query';
import { GetToeicTestByIdHandler } from './application/queries/get-toeic-test-by-id.query';
import { TOEIC_QUERY_REPOSITORY } from './application/ports/toeic-query.repository';
import { ToeicQueryRepository } from './infrastructure/repositories/toeic-query.repository';

const queryHandlers = [ListToeicTestsHandler, GetToeicTestByIdHandler];

@Module({
  imports: [
    TypeOrmModule.forFeature([ToeicTestEntity, ToeicQuestionEntity]),
    CqrsModule,
  ],
  controllers: [ToeicController],
  providers: [
    ...queryHandlers,
    {
      provide: TOEIC_QUERY_REPOSITORY,
      useClass: ToeicQueryRepository,
    },
  ],
})
export class ToeicModule {}
