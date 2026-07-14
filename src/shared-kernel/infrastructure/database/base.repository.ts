import { Repository, SelectQueryBuilder } from 'typeorm';
import { BaseEntity } from './base.entity';

export abstract class BaseRepository<T extends BaseEntity> {
  constructor(protected readonly repository: Repository<T>) {}

  protected query(alias: string = 'entity'): SelectQueryBuilder<T> {
    return this.repository
      .createQueryBuilder(alias)
      .where(`${alias}.deletedAt IS NULL`);
  }

  async softDelete(id: string, deletedBy?: string): Promise<void> {
    await this.repository.update(id, {
      deletedAt: new Date(),
      updatedBy: deletedBy,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  }

  async hardDelete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async restore(id: string): Promise<void> {
    await this.repository.update(id, {
      deletedAt: null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  }
}
