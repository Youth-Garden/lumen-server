import type { ExceptionMap } from '../../../../shared/domain/exceptions/app.exception';

export const GrammarEx = {
  TopicNotFound: {
    code: 'GRAMMAR_TOPIC_NOT_FOUND',
    message: 'Grammar topic not found',
    httpStatus: 404,
  },
  LessonNotFound: {
    code: 'GRAMMAR_LESSON_NOT_FOUND',
    message: 'Grammar lesson not found',
    httpStatus: 404,
  },
  ExerciseNotFound: {
    code: 'GRAMMAR_EXERCISE_NOT_FOUND',
    message: 'Grammar exercise not found',
    httpStatus: 404,
  },
} satisfies ExceptionMap;
