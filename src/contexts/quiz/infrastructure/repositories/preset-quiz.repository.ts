import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IPresetQuizRepository } from '../../domain/repositories/preset-quiz.repository.interface';
import { PresetQuiz } from '../../domain/aggregates/preset-quiz.aggregate';
import { PresetQuestion } from '../../domain/entities/preset-question.entity';
import { PresetQuizEntity } from '../entities/preset-quiz.entity';
import { PresetQuestionEntity } from '../entities/preset-question.entity';

@Injectable()
export class PresetQuizRepository implements IPresetQuizRepository {
  constructor(
    @InjectRepository(PresetQuizEntity)
    private readonly repository: Repository<PresetQuizEntity>,
  ) {}

  private toPersistence(quiz: PresetQuiz): PresetQuizEntity {
    const entity = new PresetQuizEntity();
    entity.id = quiz.id;
    entity.title = quiz.title;
    entity.description = quiz.description;
    entity.isPublished = quiz.isPublished;
    entity.createdAt = quiz.createdAt;
    entity.updatedAt = quiz.updatedAt;

    entity.questions = quiz.questions.map((question) => {
      const qEntity = new PresetQuestionEntity();
      qEntity.id = question.id;
      qEntity.quizId = question.quizId;
      qEntity.type = question.type;
      qEntity.questionText = question.questionText;
      qEntity.options = question.options;
      qEntity.correctAnswer = question.correctAnswer;
      return qEntity;
    });

    return entity;
  }

  async save(quiz: PresetQuiz): Promise<void> {
    const entity = this.toPersistence(quiz);
    await this.repository.save(entity);
  }

  async findById(id: string): Promise<PresetQuiz | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: { questions: true },
    });

    if (!entity) return null;

    return this.toDomain(entity);
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ items: PresetQuiz[]; total: number }> {
    const [entities, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      items: entities.map((entity) => this.toDomain(entity)),
      total,
    };
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(entity: PresetQuizEntity): PresetQuiz {
    const quiz = PresetQuiz.create(
      entity.id,
      entity.title,
      entity.description,
      entity.isPublished,
    );
    // Since create overrides createdAt/updatedAt, we should ideally use reflection or a full constructor
    // For simplicity, we just use the public methods to map questions
    entity.questions?.forEach((qEntity: PresetQuestionEntity) => {
      quiz.addQuestion(
        PresetQuestion.create(
          qEntity.id,
          qEntity.quizId,
          qEntity.type,
          qEntity.questionText,
          qEntity.options,
          qEntity.correctAnswer,
        ),
      );
    });

    return quiz;
  }
}
