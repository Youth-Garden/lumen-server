import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GrammarExerciseEntity } from '../entities/grammar-exercise.entity';
import { IGrammarExerciseRepository } from '../../domain/repositories/grammar-exercise.repository.interface';
import { GrammarExercise } from '../../domain/aggregates/grammar-exercise.aggregate';

@Injectable()
export class GrammarExerciseRepository implements IGrammarExerciseRepository {
  constructor(
    @InjectRepository(GrammarExerciseEntity)
    private readonly repository: Repository<GrammarExerciseEntity>,
  ) {}

  async findById(id: string): Promise<GrammarExercise | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) return null;
    return this.toDomain(entity);
  }

  async findByLessonId(lessonId: string): Promise<GrammarExercise[]> {
    const entities = await this.repository.find({
      where: { lessonId },
      order: { createdAt: 'ASC' },
    });
    return entities.map((ent) => this.toDomain(ent));
  }

  async save(exercise: GrammarExercise): Promise<void> {
    const entity = this.toPersistence(exercise);
    await this.repository.save(entity);
  }

  private toDomain(entity: GrammarExerciseEntity): GrammarExercise {
    return GrammarExercise.restore(
      entity.id,
      entity.lessonId,
      entity.questionText,
      entity.options,
      entity.correctAnswer,
      entity.explanation,
    );
  }

  private toPersistence(domain: GrammarExercise): GrammarExerciseEntity {
    const entity = new GrammarExerciseEntity();
    entity.id = domain.id;
    entity.lessonId = domain.lessonId;
    entity.questionText = domain.questionText;
    entity.options = domain.options;
    entity.correctAnswer = domain.correctAnswer;
    entity.explanation = domain.explanation;
    return entity;
  }
}
