import {
  DeckDetailResponseDto,
  DeckResponseDto,
} from '../responses/deck.response.dto';
import { DueFlashcardResponseDto } from '../responses/due-flashcard.response.dto';

export const VOCABULARY_QUERY_REPOSITORY = Symbol(
  'VOCABULARY_QUERY_REPOSITORY',
);

export interface IVocabularyQueryRepository {
  findDecksByUserId(userId: string): Promise<DeckResponseDto[]>;
  findDeckByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<DeckDetailResponseDto | null>;
  findDueFlashcards(
    userId: string,
    deckId?: string,
    limit?: number,
  ): Promise<DueFlashcardResponseDto[]>;
}
