import { BaseRepository } from '../../../../shared/infrastructure/database/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpeakingTaskEntity } from '../entities/speaking-task.entity';
import { ISpeakingTaskRepository } from '../../domain/repositories/speaking-task.repository.interface';
import { SpeakingTask } from '../../domain/aggregates/speaking-task.aggregate';
import { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface';

@Injectable()
export class SpeakingTaskRepository
  extends BaseRepository<SpeakingTaskEntity>
  implements ISpeakingTaskRepository
{
  constructor(
    @InjectRepository(SpeakingTaskEntity)
    protected readonly repository: Repository<SpeakingTaskEntity>,
  ) {
    super(repository);
  }

  async findById(id: string): Promise<SpeakingTask | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) return null;
    return this.toDomain(entity);
  }

  async findAll(filter: {
    search?: string;
    page: number;
    limit: number;
  }): Promise<PaginatedResult<SpeakingTask>> {
    const query = this.repository.createQueryBuilder('task');

    if (filter.search) {
      query.andWhere(
        '(task.title % :search OR task.title ILIKE :searchPattern OR task.prompt ILIKE :searchPattern)',
        { search: filter.search, searchPattern: `%${filter.search}%` },
      );
    }

    query.orderBy('task.createdAt', 'DESC');

    const [entities, total] = await query
      .skip((filter.page - 1) * filter.limit)
      .take(filter.limit)
      .getManyAndCount();

    return {
      items: entities.map((entity) => this.toDomain(entity)),
      total,
    };
  }

  async save(task: SpeakingTask): Promise<void> {
    const entity = this.toPersistence(task);
    await this.repository.save(entity);
  }

  private toDomain(entity: SpeakingTaskEntity): SpeakingTask {
    return SpeakingTask.restore(
      entity.id,
      entity.title,
      entity.prompt,
      entity.referenceAudioUrl,
      entity.keywords,
    );
  }

  private toPersistence(domain: SpeakingTask): SpeakingTaskEntity {
    const entity = new SpeakingTaskEntity();
    entity.id = domain.id;
    entity.title = domain.title;
    entity.prompt = domain.prompt;
    entity.referenceAudioUrl = domain.referenceAudioUrl;
    entity.keywords = domain.keywords;
    return entity;
  }
}
