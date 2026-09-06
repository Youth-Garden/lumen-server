import { BaseRepository } from '../../../../shared/infrastructure/database/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IFolderRepository } from '../../domain/repositories/folder.repository.interface';
import { Folder } from '../../domain/aggregates/folder.aggregate';
import { FolderEntity } from '../entities/folder.entity';

@Injectable()
export class FolderRepository
  extends BaseRepository<FolderEntity>
  implements IFolderRepository
{
  constructor(
    @InjectRepository(FolderEntity)
    private readonly repo: Repository<FolderEntity>,
  ) {
    super(repo);
  }

  async findById(id: string): Promise<Folder | null> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) return null;
    return Folder.restore(
      entity.id,
      entity.name,
      entity.description,
      entity.authorId,
    );
  }

  async save(folder: Folder): Promise<void> {
    const entity = new FolderEntity();
    entity.id = folder.id;
    entity.name = folder.name;
    entity.description = folder.description;
    entity.authorId = folder.authorId;
    await this.repo.save(entity);
  }

  async findByUserId(userId: string): Promise<Folder[]> {
    const entities = await this.repo.find({
      where: { authorId: userId },
      order: { createdAt: 'DESC' },
    });

    return entities.map((entity) =>
      Folder.restore(
        entity.id,
        entity.name,
        entity.description,
        entity.authorId,
      ),
    );
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
