import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IDeckRepository } from '../../domain/repositories/deck.repository.interface';
import { Deck } from '../../domain/aggregates/deck.aggregate';
import { DeckEntity } from '../entities/deck.entity';

@Injectable()
export class DeckRepository implements IDeckRepository {
  constructor(
    @InjectRepository(DeckEntity)
    private readonly repo: Repository<DeckEntity>,
  ) {}

  async findById(id: string): Promise<Deck | null> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) return null;
    return Deck.restore(
      entity.id,
      entity.name,
      entity.description,
      entity.authorId,
    );
  }

  async save(deck: Deck): Promise<void> {
    const entity = new DeckEntity();
    entity.id = deck.id;
    entity.name = deck.name;
    entity.description = deck.description;
    entity.authorId = deck.authorId;
    await this.repo.save(entity);
  }

  async findByUserId(userId: string): Promise<Deck[]> {
    const entities = await this.repo.find({
      where: { authorId: userId },
      order: { createdAt: 'DESC' },
    });

    return entities.map((entity) =>
      Deck.restore(entity.id, entity.name, entity.description, entity.authorId),
    );
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
