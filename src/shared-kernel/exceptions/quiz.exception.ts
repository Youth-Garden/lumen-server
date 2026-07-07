export const QuizEx = {
  NotEnoughWords: (limit: number) => ({
    code: 'QUIZ_NOT_ENOUGH_WORDS',
    message: `Not enough words in database to generate quiz. Need at least ${limit} words.`,
    httpStatus: 400,
  }),
  NotEnoughDistractors: () => ({
    code: 'QUIZ_NOT_ENOUGH_DISTRACTORS',
    message: 'Could not generate enough unique distractors for the question.',
    httpStatus: 400,
  }),
  NotFound: () => ({
    code: 'QUIZ_NOT_FOUND',
    message: 'Quiz not found',
    httpStatus: 404,
  }),
  Forbidden: () => ({
    code: 'QUIZ_FORBIDDEN',
    message: 'You do not have permission to access this quiz',
    httpStatus: 403, // Can be 404 in handler for safety
  }),
};
