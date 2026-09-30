import { BaseRepository } from '../../../../shared/infrastructure/database/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import type { IFlashcardRepository } from '../../domain/repositories/flashcard.repository.interface';
import { Flashcard } from '../../domain/aggregates/flashcard.aggregate';
import { FlashcardEntity } from '../entities/flashcard.entity';

@Injectable()
export class FlashcardRepository
  extends BaseRepository<FlashcardEntity>
  implements IFlashcardRepository
{
  constructor(
    @InjectRepository(FlashcardEntity)
    private readonly repo: Repository<FlashcardEntity>,
  ) {
    super(repo);
  }

  async findById(id: string): Promise<Flashcard | null> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) return null;
    return Flashcard.restore(entity.id, entity.folderId, entity.wordId);
  }

  async findManyByIds(ids: string[]): Promise<Map<string, Flashcard>> {
    if (ids.length === 0) return new Map();
    const entities = await this.repo.find({ where: { id: In(ids) } });
    const result = new Map<string, Flashcard>();
    for (const entity of entities) {
      result.set(
        entity.id,
        Flashcard.restore(entity.id, entity.folderId, entity.wordId),
      );
    }
    return result;
  }

  async findByFolderAndWord(
    folderId: string,
    wordId: string,
  ): Promise<Flashcard | null> {
    const entity = await this.repo.findOne({
      where: { folderId, wordId },
    });
    if (!entity) return null;
    return Flashcard.restore(entity.id, entity.folderId, entity.wordId);
  }

  async save(flashcard: Flashcard): Promise<void> {
    const entity = new FlashcardEntity();
    entity.id = flashcard.id;
    entity.folderId = flashcard.folderId;
    entity.wordId = flashcard.wordId;
    await this.repo.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
