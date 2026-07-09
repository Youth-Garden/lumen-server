import { Flashcard } from '../aggregates/flashcard.aggregate';

export const FLASHCARD_REPOSITORY = Symbol('FLASHCARD_REPOSITORY');

export interface IFlashcardRepository {
  save(flashcard: Flashcard): Promise<void>;
  findById(id: string): Promise<Flashcard | null>;
  findByDeckAndWord(deckId: string, wordId: string): Promise<Flashcard | null>;
  delete(id: string): Promise<void>;
}
