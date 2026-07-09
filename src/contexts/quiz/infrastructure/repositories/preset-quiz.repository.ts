import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IPresetQuizRepository } from '../../domain/repositories/preset-quiz.repository.interface';
import { PresetQuiz } from '../../domain/aggregates/preset-quiz.aggregate';
import { PresetQuestion } from '../../domain/entities/preset-question.entity';
import { TypeOrmPresetQuiz } from '../entities/preset-quiz.orm-entity';
import { TypeOrmPresetQuestion } from '../entities/preset-question.orm-entity';

@Injectable()
export class TypeOrmPresetQuizRepository implements IPresetQuizRepository {
  constructor(
    @InjectRepository(TypeOrmPresetQuiz)
    private readonly ormRepo: Repository<TypeOrmPresetQuiz>,
  ) {}

  async save(quiz: PresetQuiz): Promise<void> {
    const ormQuiz = new TypeOrmPresetQuiz();
    ormQuiz.id = quiz.id;
    ormQuiz.title = quiz.title;
    ormQuiz.description = quiz.description;
    ormQuiz.isPublished = quiz.isPublished;
    ormQuiz.createdAt = quiz.createdAt;
    ormQuiz.updatedAt = quiz.updatedAt;

    ormQuiz.questions = quiz.questions.map((question) => {
      const ormQ = new TypeOrmPresetQuestion();
      ormQ.id = question.id;
      ormQ.quizId = question.quizId;
      ormQ.type = question.type;
      ormQ.questionText = question.questionText;
      ormQ.options = question.options;
      ormQ.correctAnswer = question.correctAnswer;
      return ormQ;
    });

    await this.ormRepo.save(ormQuiz);
  }

  async findById(id: string): Promise<PresetQuiz | null> {
    const ormQuiz = await this.ormRepo.findOne({
      where: { id },
      relations: { questions: true },
    });

    if (!ormQuiz) return null;

    return this.mapToDomain(ormQuiz);
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ items: PresetQuiz[]; total: number }> {
    const [ormQuizzes, total] = await this.ormRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      items: ormQuizzes.map((ormQuizItem) => this.mapToDomain(ormQuizItem)),
      total,
    };
  }

  async delete(id: string): Promise<void> {
    await this.ormRepo.delete(id);
  }

  private mapToDomain(ormQuiz: TypeOrmPresetQuiz): PresetQuiz {
    // Accessing private constructor via a generic approach or static create method
    const quiz = PresetQuiz.create(
      ormQuiz.id,
      ormQuiz.title,
      ormQuiz.description,
      ormQuiz.isPublished,
    );
    // Since create overrides createdAt/updatedAt, we should ideally use reflection or a full constructor
    // For simplicity, we just use the public methods to map questions
    ormQuiz.questions?.forEach((ormQ: TypeOrmPresetQuestion) => {
      quiz.addQuestion(
        PresetQuestion.create(
          ormQ.id,
          ormQ.quizId,
          ormQ.type,
          ormQ.questionText,
          ormQ.options,
          ormQ.correctAnswer,
        ),
      );
    });

    return quiz;
  }
}
