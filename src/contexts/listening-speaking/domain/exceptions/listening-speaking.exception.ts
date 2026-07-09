import type { ExceptionMap } from '../../../../common/exceptions/app.exception';

export const ListeningSpeakingEx = {
  ListeningLessonNotFound: {
    code: 'LISTENING_LESSON_NOT_FOUND',
    message: 'Listening lesson not found',
    httpStatus: 404,
  },
  SpeakingTaskNotFound: {
    code: 'SPEAKING_TASK_NOT_FOUND',
    message: 'Speaking task not found',
    httpStatus: 404,
  },
  SpeechRecordNotFound: {
    code: 'SPEECH_RECORD_NOT_FOUND',
    message: 'Speech record not found',
    httpStatus: 404,
  },
} satisfies ExceptionMap;
