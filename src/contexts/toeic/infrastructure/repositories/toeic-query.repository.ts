import { BaseRepository } from '../../../../shared/infrastructure/database/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IToeicQueryRepository } from '../../application/ports/toeic-query.repository';
import {
  ToeicQuestionResponseDto,
  ToeicTestResponseDto,
} from '../../application/responses/toeic-test.response.dto';
import { ToeicQuestionEntity } from '../entities/toeic-question.entity';
import { ToeicTestEntity } from '../entities/toeic-test.entity';

@Injectable()
export class ToeicQueryRepository
  extends BaseRepository<ToeicTestEntity>
  implements IToeicQueryRepository
{
  constructor(
    @InjectRepository(ToeicTestEntity)
    private readonly testRepo: Repository<ToeicTestEntity>,
  ) {
    super(testRepo);
  }

  async findPublishedTests(): Promise<ToeicTestResponseDto[]> {
    const tests = await this.testRepo.find({
      where: { isPublished: true },
      order: { createdAt: 'DESC' },
    });

    return tests.map((test) => this.toTestDto(test));
  }

  async findPublishedTestById(
    id: string,
  ): Promise<ToeicTestResponseDto | null> {
    const test = await this.testRepo.findOne({
      where: { id, isPublished: true },
      relations: { questions: true },
      order: {
        questions: {
          questionNumber: 'ASC',
        },
      },
    });

    if (!test) return null;

    const dto = this.toTestDto(test);
    dto.questions = test.questions?.map((question) => {
      return this.toQuestionDto(question);
    });

    return dto;
  }

  private toTestDto(test: ToeicTestEntity): ToeicTestResponseDto {
    const dto = new ToeicTestResponseDto();
    dto.id = test.id;
    dto.title = test.title;
    dto.description = test.description;
    dto.isPublished = test.isPublished;
    dto.createdAt = test.createdAt;
    return dto;
  }

  private toQuestionDto(
    question: ToeicQuestionEntity,
  ): ToeicQuestionResponseDto {
    const dto = new ToeicQuestionResponseDto();
    dto.id = question.id;
    dto.testId = question.testId;
    dto.part = question.part;
    dto.questionNumber = question.questionNumber;
    dto.audioUrl = question.audioUrl;
    dto.imageUrl = question.imageUrl;
    dto.transcript = question.transcript;
    dto.questionText = question.questionText;
    dto.options = question.options;
    dto.materialId = question.materialId;
    dto.correctAnswer = question.correctAnswer;
    dto.explanation = question.explanation;
    dto.translation = question.translation || null;
    dto.topic = question.topic || null;
    return dto;
  }
}
