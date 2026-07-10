import type { ExceptionMap } from '../../../../common/exceptions/app.exception';

export const VocabEx = {
  WordNotFound: {
    code: 'VOCAB_WORD_NOT_FOUND',
    message: 'Word not found',
    httpStatus: 404,
  },
  WordAlreadyExists: {
    code: 'VOCAB_WORD_ALREADY_EXISTS',
    message: 'Word already exists',
    httpStatus: 400,
  },
  DeckNotFound: {
    code: 'VOCAB_DECK_NOT_FOUND',
    message: 'Deck not found',
    httpStatus: 404,
  },
  FlashcardAlreadyExists: {
    code: 'VOCAB_FLASHCARD_ALREADY_EXISTS',
    message: 'Flashcard already exists in this deck',
    httpStatus: 400,
  },
  FlashcardNotFound: {
    code: 'VOCAB_FLASHCARD_NOT_FOUND',
    message: 'Flashcard not found',
    httpStatus: 404,
  },
  NotDeckOwner: {
    code: 'VOCAB_NOT_DECK_OWNER',
    message: 'Not authorized to modify this deck',
    httpStatus: 403,
  },
  InvalidGrade: {
    code: 'VOCAB_INVALID_GRADE',
    message: 'Grade must be between 0 and 5',
    httpStatus: 400,
  },
} satisfies ExceptionMap;
