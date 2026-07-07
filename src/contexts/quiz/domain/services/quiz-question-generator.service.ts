import { Injectable } from '@nestjs/common';
import { VocabularyWord } from '../../../vocabulary/domain/aggregates/vocabulary-word.aggregate';
import { Question } from '../entities/question.entity';
import { QuestionType } from '../enums/quiz.enum';
import { randomUUID } from 'crypto';
import { AppException, QuizEx } from '../../../../shared-kernel/exceptions';

@Injectable()
export class QuizQuestionGeneratorService {
  generateQuestions(
    quizId: string,
    words: VocabularyWord[],
    limit: number,
  ): Question[] {
    if (words.length < limit) {
      throw new AppException(QuizEx.NotEnoughWords(limit));
    }

    const questionWords = words.slice(0, limit);
    const distractorPool = words.slice(limit);
    const questions: Question[] = [];

    for (let i = 0; i < questionWords.length; i++) {
      const word = questionWords[i];

      const definition =
        word.definitions.length > 0 ? word.definitions[0].definitionEn : 'N/A';
      const correctAnswer = word.term;
      const options = [correctAnswer];

      // We need 3 distractors
      let retries = 0;
      const maxRetries = 10;

      while (options.length < 4 && retries < maxRetries) {
        if (distractorPool.length > 0) {
          // Take from distractor pool first
          const distractor = distractorPool.shift()?.term;
          if (distractor && !options.includes(distractor)) {
            options.push(distractor);
          }
        } else {
          // Take randomly from all words if pool is empty
          const randomWord = words[Math.floor(Math.random() * words.length)];
          const distractor = randomWord.term;
          if (distractor && !options.includes(distractor)) {
            options.push(distractor);
          } else {
            retries++;
          }
        }
      }

      // If we couldn't find enough unique distractors, we might still proceed but log or fail.
      // Actually, if we absolutely need 4 options and can't find them, we can fail.
      if (options.length < 4) {
        throw new AppException(QuizEx.NotEnoughDistractors());
      }

      // Shuffle options
      for (let k = options.length - 1; k > 0; k--) {
        const r = Math.floor(Math.random() * (k + 1));
        [options[k], options[r]] = [options[r], options[k]];
      }

      const question = Question.create(
        randomUUID(),
        quizId,
        word.id,
        QuestionType.MULTIPLE_CHOICE,
        definition,
        options,
        correctAnswer,
        null, // userAnswer
        null, // isCorrect
      );
      questions.push(question);
    }

    return questions;
  }
}
