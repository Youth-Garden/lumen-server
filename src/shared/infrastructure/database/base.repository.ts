import { Repository, SelectQueryBuilder } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseEntity } from './base.entity';

export abstract class BaseRepository<T extends BaseEntity> {
  constructor(protected readonly repository: Repository<T>) {}

  protected query(alias: string): SelectQueryBuilder<T> {
    return this.repository
      .createQueryBuilder(alias)
      .where(`${alias}.deletedAt IS NULL`);
  }

  async softDelete(id: string, deletedBy?: string): Promise<void> {
    await this.repository.update(id, {
      deletedAt: new Date(),
      updatedBy: deletedBy,
    } as unknown as QueryDeepPartialEntity<T>);
  }

  async hardDelete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async restore(id: string): Promise<void> {
    await this.repository.update(id, {
      deletedAt: null,
    } as unknown as QueryDeepPartialEntity<T>);
  }
}
