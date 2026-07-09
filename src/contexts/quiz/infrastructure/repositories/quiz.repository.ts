import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IQuizRepository } from '../../domain/repositories/quiz.repository.interface';
import { PaginatedResult } from '../../../../shared-kernel/interfaces/paginated-result.interface';
import { Quiz } from '../../domain/aggregates/quiz.aggregate';
import { Question } from '../../domain/entities/question.entity';
import { QuizEntity } from '../entities/quiz.entity';
import { QuestionEntity } from '../entities/question.entity';
import { QuizStatus, QuestionType } from '../../domain/enums/quiz.enum';

@Injectable()
export class QuizRepository implements IQuizRepository {
  constructor(
    @InjectRepository(QuizEntity)
    private readonly quizRepo: Repository<QuizEntity>,
  ) {}

  async findById(id: string): Promise<Quiz | null> {
    const entity = await this.quizRepo.findOne({
      where: { id },
      relations: { questions: true },
    });

    if (!entity) return null;

    const questions = entity.questions.map((q) =>
      Question.create(
        q.id,
        q.quizId,
        q.wordId,
        q.type as QuestionType,
        q.questionText,
        q.options,
        q.correctAnswer,
        q.userAnswer,
        q.isCorrect,
      ),
    );

    return Quiz.restore(
      entity.id,
      entity.userId,
      entity.status as QuizStatus,
      entity.score,
      questions,
      entity.createdAt,
      entity.completedAt,
    );
  }

  async save(quiz: Quiz): Promise<void> {
    const entity = new QuizEntity();
    entity.id = quiz.id;
    entity.userId = quiz.userId;
    entity.status = quiz.status;
    entity.score = quiz.score;
    entity.createdAt = quiz.createdAt;
    entity.completedAt = quiz.completedAt;

    entity.questions = quiz.questions.map((q) => {
      const qe = new QuestionEntity();
      qe.id = q.id;
      qe.quizId = q.quizId;
      qe.wordId = q.wordId;
      qe.type = q.type;
      qe.questionText = q.questionText;
      qe.options = q.options;
      qe.correctAnswer = q.correctAnswer;
      qe.userAnswer = q.userAnswer;
      qe.isCorrect = q.isCorrect;
      return qe;
    });

    await this.quizRepo.save(entity);
  }

  async findByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Quiz>> {
    const [entities, total] = await this.quizRepo.findAndCount({
      where: { userId },
      relations: { questions: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const items = entities.map((entity) => {
      const questions = entity.questions.map((q) =>
        Question.create(
          q.id,
          q.quizId,
          q.wordId,
          q.type as QuestionType,
          q.questionText,
          q.options,
          q.correctAnswer,
          q.userAnswer,
          q.isCorrect,
        ),
      );
      return Quiz.restore(
        entity.id,
        entity.userId,
        entity.status as QuizStatus,
        entity.score,
        questions,
        entity.createdAt,
        entity.completedAt,
      );
    });

    return { items, total };
  }

  async findByIdAndUserId(id: string, userId: string): Promise<Quiz | null> {
    const entity = await this.quizRepo.findOne({
      where: { id, userId },
      relations: { questions: true },
    });

    if (!entity) return null;

    const questions = entity.questions.map((q) =>
      Question.create(
        q.id,
        q.quizId,
        q.wordId,
        q.type as QuestionType,
        q.questionText,
        q.options,
        q.correctAnswer,
        q.userAnswer,
        q.isCorrect,
      ),
    );

    return Quiz.restore(
      entity.id,
      entity.userId,
      entity.status as QuizStatus,
      entity.score,
      questions,
      entity.createdAt,
      entity.completedAt,
    );
  }
}
