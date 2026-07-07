import { VocabularyWord } from '../aggregates/vocabulary-word.aggregate';

export const VOCABULARY_WORD_REPOSITORY = Symbol('VOCABULARY_WORD_REPOSITORY');

export interface IVocabularyWordRepository {
  save(word: VocabularyWord): Promise<void>;
  findById(id: string): Promise<VocabularyWord | null>;
  findByTerm(term: string): Promise<VocabularyWord | null>;
  findRandom(limit: number): Promise<VocabularyWord[]>;
}
