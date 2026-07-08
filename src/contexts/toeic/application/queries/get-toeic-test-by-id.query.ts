import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ToeicTestEntity } from '../../infrastructure/typeorm/entities/toeic-test.entity';
import { ToeicQuestionEntity } from '../../infrastructure/typeorm/entities/toeic-question.entity';
import {
  ToeicTestResponseDto,
  ToeicQuestionResponseDto,
} from '../dtos/toeic-test.response.dto';
import { NotFoundException } from '@nestjs/common';

export class GetToeicTestByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetToeicTestByIdQuery)
export class GetToeicTestByIdHandler implements IQueryHandler<
  GetToeicTestByIdQuery,
  ToeicTestResponseDto
> {
  constructor(
    @InjectRepository(ToeicTestEntity)
    private readonly testRepo: Repository<ToeicTestEntity>,
  ) {}

  async execute(query: GetToeicTestByIdQuery): Promise<ToeicTestResponseDto> {
    const test = await this.testRepo.findOne({
      where: { id: query.id, isPublished: true },
      relations: { questions: true },
      order: {
        questions: {
          questionNumber: 'ASC',
        },
      },
    });

    if (!test) {
      throw new NotFoundException('Toeic test not found');
    }

    const dto = new ToeicTestResponseDto();
    dto.id = test.id;
    dto.title = test.title;
    dto.description = test.description;
    dto.isPublished = test.isPublished;
    dto.createdAt = test.createdAt;

    if (test.questions) {
      dto.questions = test.questions.map((question: ToeicQuestionEntity) => {
        const questionDto = new ToeicQuestionResponseDto();
        questionDto.id = question.id;
        questionDto.testId = question.testId;
        questionDto.part = question.part;
        questionDto.questionNumber = question.questionNumber;
        questionDto.audioUrl = question.audioUrl;
        questionDto.imageUrl = question.imageUrl;
        questionDto.transcript = question.transcript;
        questionDto.questionText = question.questionText;
        questionDto.options = question.options;
        questionDto.materialId = question.materialId;
        questionDto.correctAnswer = question.correctAnswer;
        questionDto.explanation = question.explanation;
        return questionDto;
      });
    }

    return dto;
  }
}
