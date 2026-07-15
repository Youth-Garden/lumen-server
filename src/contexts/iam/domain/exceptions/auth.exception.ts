import type { ExceptionMap } from '../../../../shared/domain/exceptions/app.exception';

export const AuthEx = {
  UserNotFound: {
    code: 'AUTH_USER_NOT_FOUND',
    message: 'User not found',
    httpStatus: 404,
  },
  InvalidCredentials: {
    code: 'AUTH_INVALID_CREDENTIALS',
    message: 'Invalid email or password',
    httpStatus: 401,
  },
  EmailAlreadyExists: (email: string) => ({
    code: 'AUTH_EMAIL_ALREADY_EXISTS',
    message: `Email ${email} already exists`,
    httpStatus: 400,
  }),
  MissingRefreshToken: {
    code: 'AUTH_MISSING_REFRESH_TOKEN',
    message: 'Refresh token is missing',
    httpStatus: 401,
  },
} satisfies ExceptionMap;
