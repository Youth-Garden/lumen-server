import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ListQuizzesQuery } from './list-quizzes.query';
import { QUIZ_REPOSITORY } from '../../domain/repositories/quiz.repository.interface';
import type { IQuizRepository } from '../../domain/repositories/quiz.repository.interface';
import { ApiProperty } from '@nestjs/swagger';

export class QuizListItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  score: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  completedAt?: Date;
}

export class QuizListResponseDto {
  @ApiProperty({ type: [QuizListItemDto] })
  items: QuizListItemDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}

@QueryHandler(ListQuizzesQuery)
export class ListQuizzesHandler implements IQueryHandler<
  ListQuizzesQuery,
  QuizListResponseDto
> {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
  ) {}

  async execute(query: ListQuizzesQuery): Promise<QuizListResponseDto> {
    const { items, total } = await this.quizRepository.findByUserId(
      query.userId,
      query.page,
      query.limit,
    );

    return {
      items: items.map((quiz) => ({
        id: quiz.id,
        status: quiz.status,
        score: quiz.score,
        createdAt: quiz.createdAt,
        completedAt: quiz.completedAt || undefined,
      })),
      total,
      page: query.page,
      limit: query.limit,
    };
  }
}
