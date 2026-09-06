import type { ExceptionMap } from '../../../../shared/domain/exceptions/app.exception';

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
  FolderNotFound: {
    code: 'VOCAB_FOLDER_NOT_FOUND',
    message: 'Folder not found',
    httpStatus: 404,
  },
  FlashcardAlreadyExists: {
    code: 'VOCAB_FLASHCARD_ALREADY_EXISTS',
    message: 'Flashcard already exists in this folder',
    httpStatus: 400,
  },
  FlashcardNotFound: {
    code: 'VOCAB_FLASHCARD_NOT_FOUND',
    message: 'Flashcard not found',
    httpStatus: 404,
  },
  NotFolderOwner: {
    code: 'VOCAB_NOT_FOLDER_OWNER',
    message: 'Not authorized to modify this folder',
    httpStatus: 403,
  },
  InvalidReviewQuality: {
    code: 'VOCAB_INVALID_REVIEW_QUALITY',
    message: 'Quality must be between 1 and 4',
    httpStatus: 400,
  },
} satisfies ExceptionMap;
