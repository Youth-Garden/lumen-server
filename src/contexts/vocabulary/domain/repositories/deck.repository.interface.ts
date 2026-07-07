import { Deck } from '../aggregates/deck.aggregate';

export const DECK_REPOSITORY = Symbol('DECK_REPOSITORY');

export interface IDeckRepository {
  save(deck: Deck): Promise<void>;
  findById(id: string): Promise<Deck | null>;
}
