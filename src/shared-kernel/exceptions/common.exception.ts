export const CommonEx = {
  Unauthorized: {
    code: 'UNAUTHORIZED',
    message: 'Unauthorized',
    httpStatus: 401,
  },
  ValidationError: {
    code: 'VALIDATION_ERROR',
    message: 'Validation failed',
    httpStatus: 400,
  },
  Forbidden: { code: 'FORBIDDEN', message: 'Forbidden', httpStatus: 403 },
  NotFound: { code: 'NOT_FOUND', message: 'Not found', httpStatus: 404 },
  InternalError: {
    code: 'INTERNAL_ERROR',
    message: 'Internal server error',
    httpStatus: 500,
  },
};
