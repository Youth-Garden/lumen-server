import { BaseRepository } from '../../../../shared-kernel/infrastructure/database/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IExamAttemptRepository } from '../../domain/repositories/exam-attempt.repository.interface';
import { ExamAttempt } from '../../domain/aggregates/exam-attempt.aggregate';
import { ExamAttemptEntity } from '../entities/exam-attempt.entity';
import { ExamAnswer } from '../../domain/entities/exam-answer.entity';

@Injectable()
export class ExamAttemptRepository
  extends BaseRepository<ExamAttemptEntity>
  implements IExamAttemptRepository
{
  constructor(
    @InjectRepository(ExamAttemptEntity)
    protected readonly repository: Repository<ExamAttemptEntity>,
  ) {
    super(repository);
  }

  async save(attempt: ExamAttempt): Promise<void> {
    const entity = this.toPersistence(attempt);
    await this.repository.save(entity);
  }

  async findById(id: string): Promise<ExamAttempt | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) return null;
    return this.toDomain(entity);
  }

  async findByUserId(userId: string): Promise<ExamAttempt[]> {
    const entities = await this.repository.find({
      where: { userId },
      order: { startedAt: 'DESC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findByUserIdPaged(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{ items: ExamAttempt[]; total: number }> {
    const [entities, total] = await this.repository.findAndCount({
      where: { userId },
      order: { startedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items: entities.map((entity) => this.toDomain(entity)), total };
  }

  private toPersistence(attempt: ExamAttempt): ExamAttemptEntity {
    const entity = new ExamAttemptEntity();
    entity.id = attempt.id;
    entity.userId = attempt.userId;
    entity.testId = attempt.testId;
    entity.testType = attempt.testType;
    entity.status = attempt.status;
    entity.mode = attempt.mode;
    entity.partsAttempted = attempt.partsAttempted;
    entity.questionIds = attempt.questionIds;
    entity.customTimeLimit = attempt.customTimeLimit;
    entity.elapsedSeconds = attempt.elapsedSeconds;
    entity.listeningScore = attempt.listeningScore;
    entity.readingScore = attempt.readingScore;
    entity.totalScore = attempt.totalScore;
    entity.startedAt = attempt.startedAt;
    entity.completedAt = attempt.completedAt;
    entity.answers = attempt.answers.map((answer) => ({
      questionId: answer.questionId,
      userAnswer: answer.userAnswer,
      isCorrect: answer.isCorrect,
      timeSpent: answer.timeSpent,
      flaggedHard: answer.flaggedHard,
    }));
    return entity;
  }

  private toDomain(entity: ExamAttemptEntity): ExamAttempt {
    const answers = (entity.answers || []).map(
      (answer) =>
        new ExamAnswer(
          answer.questionId,
          answer.userAnswer,
          answer.isCorrect,
          answer.timeSpent || 0,
          answer.flaggedHard || false,
        ),
    );

    return ExamAttempt.restore(
      entity.id,
      entity.userId,
      entity.testId,
      entity.testType,
      entity.status,
      entity.listeningScore,
      entity.readingScore,
      entity.totalScore,
      entity.startedAt,
      entity.completedAt,
      answers,
      entity.mode,
      entity.partsAttempted || [],
      entity.customTimeLimit,
      entity.elapsedSeconds,
      entity.questionIds,
    );
  }
}
