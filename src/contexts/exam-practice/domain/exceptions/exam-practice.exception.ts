import type { ExceptionMap } from '../../../../common/exceptions/app.exception';

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
} satisfies ExceptionMap;
