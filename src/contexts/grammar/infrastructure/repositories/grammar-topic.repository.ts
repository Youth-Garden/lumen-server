import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../../shared-kernel/infrastructure/database/base.repository';
import { PaginatedResult } from '../../../../shared-kernel/interfaces/paginated-result.interface';
import { GrammarTopic } from '../../domain/aggregates/grammar-topic.aggregate';
import { GrammarLesson } from '../../domain/entities/grammar-lesson.entity';
import { IGrammarTopicRepository } from '../../domain/repositories/grammar-topic.repository.interface';
import { GrammarLessonEntity } from '../entities/grammar-lesson.entity';
import { GrammarTopicEntity } from '../entities/grammar-topic.entity';

@Injectable()
export class GrammarTopicRepository
  extends BaseRepository<GrammarTopicEntity>
  implements IGrammarTopicRepository
{
  constructor(
    @InjectRepository(GrammarTopicEntity)
    protected readonly repository: Repository<GrammarTopicEntity>,
  ) {
    super(repository);
  }

  async findById(id: string): Promise<GrammarTopic | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: { lessons: true },
    });

    if (!entity) return null;

    return this.toDomain(entity);
  }

  async findAll(filter: {
    search?: string;
    cefrLevel?: string;
    page: number;
    limit: number;
  }): Promise<PaginatedResult<GrammarTopic>> {
    const query = this.repository
      .createQueryBuilder('topic')
      .leftJoinAndSelect('topic.lessons', 'lesson');

    if (filter.search) {
      query.andWhere(
        '(topic.title ILIKE :search OR topic.description ILIKE :search)',
        { search: `%${filter.search}%` },
      );
    }

    if (filter.cefrLevel) {
      query.andWhere('topic.cefrLevel = :cefrLevel', {
        cefrLevel: filter.cefrLevel,
      });
    }

    query.orderBy('topic.createdAt', 'DESC');

    const [entities, total] = await query
      .skip((filter.page - 1) * filter.limit)
      .take(filter.limit)
      .getManyAndCount();

    return {
      items: entities.map((ent) => this.toDomain(ent)),
      total,
    };
  }

  async save(topic: GrammarTopic): Promise<void> {
    const entity = this.toPersistence(topic);
    await this.repository.save(entity);
  }

  private toDomain(entity: GrammarTopicEntity): GrammarTopic {
    const lessons = (entity.lessons || []).map(
      (lessonEntity: GrammarLessonEntity) =>
        new GrammarLesson(
          lessonEntity.id,
          lessonEntity.topicId,
          lessonEntity.title,
          lessonEntity.content,
          lessonEntity.orderIndex,
        ),
    );
    return GrammarTopic.restore(
      entity.id,
      entity.title,
      entity.description,
      entity.cefrLevel,
      lessons,
    );
  }

  private toPersistence(domain: GrammarTopic): GrammarTopicEntity {
    const entity = new GrammarTopicEntity();
    entity.id = domain.id;
    entity.title = domain.title;
    entity.description = domain.description;
    entity.cefrLevel = domain.cefrLevel;
    entity.lessons = domain.lessons.map((lesson: GrammarLesson) => {
      const lessonEntity = new GrammarLessonEntity();
      lessonEntity.id = lesson.id;
      lessonEntity.topicId = lesson.topicId;
      lessonEntity.title = lesson.title;
      lessonEntity.content = lesson.content;
      lessonEntity.orderIndex = lesson.orderIndex;
      return lessonEntity;
    });

    return entity;
  }
}
