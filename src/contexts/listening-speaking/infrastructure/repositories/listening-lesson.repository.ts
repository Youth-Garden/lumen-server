import { BaseRepository } from '../../../../shared/infrastructure/database/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListeningLessonEntity } from '../entities/listening-lesson.entity';
import { IListeningLessonRepository } from '../../domain/repositories/listening-lesson.repository.interface';
import { ListeningLesson } from '../../domain/aggregates/listening-lesson.aggregate';
import { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface';

@Injectable()
export class ListeningLessonRepository
  extends BaseRepository<ListeningLessonEntity>
  implements IListeningLessonRepository
{
  constructor(
    @InjectRepository(ListeningLessonEntity)
    protected readonly repository: Repository<ListeningLessonEntity>,
  ) {
    super(repository);
  }

  async findById(id: string): Promise<ListeningLesson | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) return null;
    return this.toDomain(entity);
  }

  async findAll(filter: {
    search?: string;
    cefrLevel?: string;
    page: number;
    limit: number;
  }): Promise<PaginatedResult<ListeningLesson>> {
    const query = this.repository.createQueryBuilder('lesson');

    if (filter.search) {
      query.andWhere('lesson.title ILIKE :search', {
        search: `%${filter.search}%`,
      });
    }

    if (filter.cefrLevel) {
      query.andWhere('lesson.cefrLevel = :cefrLevel', {
        cefrLevel: filter.cefrLevel,
      });
    }

    query.orderBy('lesson.createdAt', 'DESC');

    const [entities, total] = await query
      .skip((filter.page - 1) * filter.limit)
      .take(filter.limit)
      .getManyAndCount();

    return {
      items: entities.map((entity) => this.toDomain(entity)),
      total,
    };
  }

  async save(lesson: ListeningLesson): Promise<void> {
    const entity = this.toPersistence(lesson);
    await this.repository.save(entity);
  }

  private toDomain(entity: ListeningLessonEntity): ListeningLesson {
    return ListeningLesson.restore(
      entity.id,
      entity.title,
      entity.audioUrl,
      entity.cefrLevel,
      entity.transcript,
    );
  }

  private toPersistence(domain: ListeningLesson): ListeningLessonEntity {
    const entity = new ListeningLessonEntity();
    entity.id = domain.id;
    entity.title = domain.title;
    entity.audioUrl = domain.audioUrl;
    entity.cefrLevel = domain.cefrLevel;
    entity.transcript = domain.transcript;
    return entity;
  }
}
