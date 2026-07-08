import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ToeicTestEntity } from './infrastructure/typeorm/entities/toeic-test.entity';
import { ToeicQuestionEntity } from './infrastructure/typeorm/entities/toeic-question.entity';
import { ToeicController } from './presentation/http/toeic.controller';
import { ListToeicTestsHandler } from './application/queries/list-toeic-tests.query';
import { GetToeicTestByIdHandler } from './application/queries/get-toeic-test-by-id.query';

const queryHandlers = [ListToeicTestsHandler, GetToeicTestByIdHandler];

@Module({
  imports: [
    TypeOrmModule.forFeature([ToeicTestEntity, ToeicQuestionEntity]),
    CqrsModule,
  ],
  controllers: [ToeicController],
  providers: [...queryHandlers],
})
export class ToeicModule {}
