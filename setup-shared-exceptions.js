const fs = require('fs');
const path = require('path');

const exDir = path.join(__dirname, 'src/shared-kernel/exceptions');

// 1. app.exception.ts
fs.writeFileSync(path.join(exDir, 'app.exception.ts'),
`export interface ErrorDefinition {
  code: string;
  message: string;
  httpStatus: number;
}

export class AppException extends Error {
  public readonly code: string;
  public readonly httpStatus: number;

  constructor(errorDef: ErrorDefinition) {
    super(errorDef.message);
    this.code = errorDef.code;
    this.httpStatus = errorDef.httpStatus;
    this.name = 'AppException';
  }
}
`);

// 2. common.exception.ts
fs.writeFileSync(path.join(exDir, 'common.exception.ts'),
`export const CommonEx = {
  Unauthorized: { code: 'UNAUTHORIZED', message: 'Unauthorized', httpStatus: 401 },
  ValidationError: { code: 'VALIDATION_ERROR', message: 'Validation failed', httpStatus: 400 },
  Forbidden: { code: 'FORBIDDEN', message: 'Forbidden', httpStatus: 403 },
  NotFound: { code: 'NOT_FOUND', message: 'Not found', httpStatus: 404 },
  InternalError: { code: 'INTERNAL_ERROR', message: 'Internal server error', httpStatus: 500 },
};
`);

// 3. auth.exception.ts
fs.writeFileSync(path.join(exDir, 'auth.exception.ts'),
`export const AuthEx = {
  UserNotFound: { code: 'AUTH_USER_NOT_FOUND', message: 'User not found', httpStatus: 404 },
  InvalidCredentials: { code: 'AUTH_INVALID_CREDENTIALS', message: 'Invalid email or password', httpStatus: 401 },
  EmailAlreadyExists: (email: string) => ({ 
    code: 'AUTH_EMAIL_ALREADY_EXISTS', 
    message: \`Email \${email} already exists\`, 
    httpStatus: 400 
  }),
};
`);

// 4. vocabulary.exception.ts
fs.writeFileSync(path.join(exDir, 'vocabulary.exception.ts'),
`export const VocabEx = {
  WordNotFound: (id: string) => ({ 
    code: 'VOCAB_WORD_NOT_FOUND', 
    message: \`Word with ID \${id} not found\`, 
    httpStatus: 404 
  }),
};
`);

// 5. quiz.exception.ts
fs.writeFileSync(path.join(exDir, 'quiz.exception.ts'),
`export const QuizEx = {
  NotEnoughWords: (limit: number) => ({ 
    code: 'QUIZ_NOT_ENOUGH_WORDS', 
    message: \`Not enough words in database to generate quiz. Need at least \${limit} words.\`, 
    httpStatus: 400 
  }),
};
`);

// 6. index.ts
fs.writeFileSync(path.join(exDir, 'index.ts'),
`export * from './app.exception';
export * from './common.exception';
export * from './auth.exception';
export * from './vocabulary.exception';
export * from './quiz.exception';
`);

console.log('Shared exceptions created.');
