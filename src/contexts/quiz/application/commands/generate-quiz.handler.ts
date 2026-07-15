import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GenerateQuizCommand } from './generate-quiz.command';
import type { IQuizRepository } from '../../domain/repositories/quiz.repository.interface';
import { QUIZ_REPOSITORY } from '../../domain/repositories/quiz.repository.interface';
import { Quiz } from '../../domain/aggregates/quiz.aggregate';
import { randomUUID } from 'crypto';
import type { IVocabularyWordRepository } from '../../../vocabulary/domain/repositories/vocabulary-word.repository.interface';
import { VOCABULARY_WORD_REPOSITORY } from '../../../vocabulary/domain/repositories/vocabulary-word.repository.interface';
import { AppException } from '../../../../shared/domain/exceptions';
import { QuizEx } from '../../domain/exceptions/quiz.exception';
import { QuizQuestionFactory } from '../../domain/factories/quiz-question.factory';

@CommandHandler(GenerateQuizCommand)
export class GenerateQuizHandler implements ICommandHandler<
  GenerateQuizCommand,
  string
> {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepo: IQuizRepository,
    @Inject(VOCABULARY_WORD_REPOSITORY)
    private readonly wordRepo: IVocabularyWordRepository,
    private readonly questionGenerator: QuizQuestionFactory,
  ) {}

  async execute(command: GenerateQuizCommand): Promise<string> {
    const { limit, userId } = command;

    const requiredWordsCount = limit * 4;
    const words = await this.wordRepo.findRandom(requiredWordsCount);

    if (words.length < limit) {
      throw new AppException(QuizEx.NotEnoughWords(limit));
    }

    const quizId = randomUUID();
    const quiz = Quiz.create(quizId, userId);

    const questions = this.questionGenerator.generateQuestions(
      quizId,
      words,
      limit,
    );

    for (const question of questions) {
      quiz.addQuestion(question);
    }

    await this.quizRepo.save(quiz);

    return quizId;
  }
}
