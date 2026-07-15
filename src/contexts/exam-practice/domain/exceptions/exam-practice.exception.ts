import type { ExceptionMap } from '../../../../shared/domain/exceptions/app.exception';

export const ExamPracticeEx = {
  AttemptNotFound: {
    code: 'EXAM_ATTEMPT_NOT_FOUND',
    message: 'Exam attempt not found',
    httpStatus: 404,
  },
  AttemptAlreadyCompleted: {
    code: 'EXAM_ATTEMPT_ALREADY_COMPLETED',
    message: 'This exam attempt has already been completed',
    httpStatus: 400,
  },
  AttemptNotCompleted: {
    code: 'EXAM_ATTEMPT_NOT_COMPLETED',
    message: 'The source attempt must be completed before retesting',
    httpStatus: 400,
  },
  NoIncorrectAnswers: {
    code: 'EXAM_NO_INCORRECT_ANSWERS',
    message: 'No incorrect answers found in this attempt to retest',
    httpStatus: 400,
  },
  AttemptNotActive: {
    code: 'EXAM_ATTEMPT_NOT_ACTIVE',
    message: 'This exam attempt is not currently active',
    httpStatus: 400,
  },
} satisfies ExceptionMap;
