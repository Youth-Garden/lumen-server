import type { ExceptionMap } from '../../../../shared/domain/exceptions/app.exception';

export const ProgressEx = {
  ProfileNotFound: {
    code: 'PROGRESS_PROFILE_NOT_FOUND',
    message: 'Learning profile not found',
    httpStatus: 404,
  },
  InsufficientPoints: {
    code: 'PROGRESS_INSUFFICIENT_POINTS',
    message: 'Not enough XP points to purchase a streak freeze',
    httpStatus: 400,
  },
} satisfies ExceptionMap;
