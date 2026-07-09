import type { ExceptionMap } from '../../../../common/exceptions/app.exception';

export const ToeicEx = {
  TestNotFound: {
    code: 'TOEIC_TEST_NOT_FOUND',
    message: 'TOEIC test not found',
    httpStatus: 404,
  },
  TestNotPublished: {
    code: 'TOEIC_TEST_NOT_PUBLISHED',
    message: 'TOEIC test is not published',
    httpStatus: 403,
  },
} satisfies ExceptionMap;
