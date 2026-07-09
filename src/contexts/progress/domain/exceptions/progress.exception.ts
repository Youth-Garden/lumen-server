import type { ExceptionMap } from '../../../../common/exceptions/app.exception';

export const ProgressEx = {
  ProfileNotFound: {
    code: 'PROGRESS_PROFILE_NOT_FOUND',
    message: 'Learning profile not found',
    httpStatus: 404,
  },
} satisfies ExceptionMap;
