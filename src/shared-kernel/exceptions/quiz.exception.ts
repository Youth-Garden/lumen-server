export const QuizEx = {
  NotEnoughWords: (limit: number) => ({
    code: 'QUIZ_NOT_ENOUGH_WORDS',
    message: `Not enough words in database to generate quiz. Need at least ${limit} words.`,
    httpStatus: 400,
  }),
};
