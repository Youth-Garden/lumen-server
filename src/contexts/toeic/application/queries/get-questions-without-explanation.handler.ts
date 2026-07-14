import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ToeicQuestionEntity } from '../../infrastructure/entities/toeic-question.entity';
import { MissingExplanationResponseDto } from '../responses/missing-explanation.response.dto';

export class GetQuestionsWithoutExplanationQuery {}

@QueryHandler(GetQuestionsWithoutExplanationQuery)
export class GetQuestionsWithoutExplanationHandler implements IQueryHandler<
  GetQuestionsWithoutExplanationQuery,
  MissingExplanationResponseDto[]
> {
  constructor(
    @InjectRepository(ToeicQuestionEntity)
    private readonly questionRepo: Repository<ToeicQuestionEntity>,
  ) {}

  async execute(): Promise<MissingExplanationResponseDto[]> {
    const questions = await this.questionRepo.find({
      where: [{ explanation: IsNull() }, { explanation: '' }],
      relations: {
        test: true,
      },
      select: {
        id: true,
        questionNumber: true,
        questionText: true,
        part: true,
        test: {
          id: true,
          title: true,
        },
      },
      order: {
        test: {
          title: 'ASC',
        },
        questionNumber: 'ASC',
      },
      take: 100, // Limit for performance
    });

    return questions.map((q) => ({
      id: q.id,
      questionNumber: q.questionNumber,
      questionText: q.questionText,
      part: q.part,
      testTitle: q.test?.title || 'Unknown Test',
      testId: q.test?.id,
    }));
  }
}
