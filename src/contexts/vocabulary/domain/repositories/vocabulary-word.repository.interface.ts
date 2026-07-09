import { PaginatedResult } from '../../../../shared-kernel/interfaces/paginated-result.interface';
import { VocabularyWord } from '../aggregates/vocabulary-word.aggregate';

export const VOCABULARY_WORD_REPOSITORY = Symbol('VOCABULARY_WORD_REPOSITORY');

export interface IVocabularyWordRepository {
  save(word: VocabularyWord): Promise<void>;
  findById(id: string): Promise<VocabularyWord | null>;
  findByTerm(term: string): Promise<VocabularyWord | null>;
  findRandom(limit: number): Promise<VocabularyWord[]>;
  findAll(filter: {
    search?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    cefrLevel?: string;
    partOfSpeech?: string;
    page: number;
    limit: number;
  }): Promise<PaginatedResult<VocabularyWord>>;
  delete(id: string): Promise<void>;
}
