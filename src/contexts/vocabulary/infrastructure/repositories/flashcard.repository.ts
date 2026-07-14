import { BaseRepository } from '../../../../shared-kernel/infrastructure/database/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    return Flashcard.restore(entity.id, entity.deckId, entity.wordId);
  }

  async findByDeckAndWord(
    deckId: string,
    wordId: string,
  ): Promise<Flashcard | null> {
    const entity = await this.repo.findOne({ where: { deckId, wordId } });
    if (!entity) return null;
    return Flashcard.restore(entity.id, entity.deckId, entity.wordId);
  }

  async save(flashcard: Flashcard): Promise<void> {
    const entity = new FlashcardEntity();
    entity.id = flashcard.id;
    entity.deckId = flashcard.deckId;
    entity.wordId = flashcard.wordId;
    await this.repo.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
