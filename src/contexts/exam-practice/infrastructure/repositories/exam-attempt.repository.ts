import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IExamAttemptRepository } from '../../domain/repositories/exam-attempt.repository.interface';
import { ExamAttempt } from '../../domain/aggregates/exam-attempt.aggregate';
import { ExamAttemptEntity } from '../entities/exam-attempt.entity';
import { ExamAnswer } from '../../domain/entities/exam-answer.entity';

@Injectable()
export class ExamAttemptRepository implements IExamAttemptRepository {
  constructor(
    @InjectRepository(ExamAttemptEntity)
    private readonly repository: Repository<ExamAttemptEntity>,
  ) {}

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
    return entities.map((e) => this.toDomain(e));
  }

  private toPersistence(attempt: ExamAttempt): ExamAttemptEntity {
    const entity = new ExamAttemptEntity();
    entity.id = attempt.id;
    entity.userId = attempt.userId;
    entity.testId = attempt.testId;
    entity.testType = attempt.testType;
    entity.status = attempt.status;
    entity.listeningScore = attempt.listeningScore;
    entity.readingScore = attempt.readingScore;
    entity.totalScore = attempt.totalScore;
    entity.startedAt = attempt.startedAt;
    entity.completedAt = attempt.completedAt;
    entity.answers = attempt.answers.map((a) => ({
      questionId: a.questionId,
      userAnswer: a.userAnswer,
      isCorrect: a.isCorrect,
    }));
    return entity;
  }

  private toDomain(entity: ExamAttemptEntity): ExamAttempt {
    const answers = (entity.answers || []).map(
      (a) => new ExamAnswer(a.questionId, a.userAnswer, a.isCorrect),
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
    );
  }
}
