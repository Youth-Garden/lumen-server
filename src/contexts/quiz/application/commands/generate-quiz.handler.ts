import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GenerateQuizCommand } from './generate-quiz.command';
import type { IQuizRepository } from '../../domain/repositories/quiz.repository.interface';
import { QUIZ_REPOSITORY } from '../../domain/repositories/quiz.repository.interface';
import { Quiz } from '../../domain/aggregates/quiz.aggregate';
import { Question } from '../../domain/entities/question.entity';
import { QuestionType } from '../../domain/enums/quiz.enum';
import { randomUUID } from 'crypto';
import type { IVocabularyWordRepository } from '../../../vocabulary/domain/repositories/vocabulary-word.repository.interface';
import { VOCABULARY_WORD_REPOSITORY } from '../../../vocabulary/domain/repositories/vocabulary-word.repository.interface';
import { AppException, QuizEx } from '../../../../shared-kernel/exceptions';

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
  ) {}

  async execute(command: GenerateQuizCommand): Promise<string> {
    const { dto, userId } = command;

    // Lấy số lượng từ vựng gấp 4 lần số lượng câu hỏi để tạo đáp án nhiễu (distractors)
    const requiredWordsCount = dto.limit * 4;
    const words = await this.wordRepo.findRandom(requiredWordsCount);

    if (words.length < dto.limit) {
      throw new AppException(QuizEx.NotEnoughWords(dto.limit));
    }

    const quizId = randomUUID();
    const quiz = Quiz.create(quizId, userId);

    // Lấy dto.limit từ vựng đầu tiên làm câu hỏi chính
    const questionWords = words.slice(0, dto.limit);
    // Phần còn lại dùng làm đáp án nhiễu
    const distractorPool = words.slice(dto.limit);

    for (let i = 0; i < questionWords.length; i++) {
      const word = questionWords[i];

      // Chọn ngẫu nhiên 1 định nghĩa để làm câu hỏi
      const definition =
        word.definitions.length > 0 ? word.definitions[0].definitionEn : 'N/A';

      const correctAnswer = word.term;

      // Lấy 3 đáp án nhiễu từ pool, ưu tiên lấy 3 từ kế tiếp
      // Nếu không đủ 3 từ, lấy random lại từ toàn bộ mảng words
      const options = [correctAnswer];

      for (let j = 0; j < 3; j++) {
        let distractor = '';
        if (distractorPool.length > 0) {
          const randIdx = Math.floor(Math.random() * distractorPool.length);
          distractor = distractorPool.splice(randIdx, 1)[0].term;
        } else {
          const randIdx = Math.floor(Math.random() * words.length);
          distractor = words[randIdx].term;
        }

        // Đảm bảo không trùng đáp án đã có
        if (!options.includes(distractor)) {
          options.push(distractor);
        } else {
          // Bù lại nếu trùng
          j--;
        }
      }

      // Xáo trộn (Shuffle) các đáp án
      const shuffledOptions = options.sort(() => 0.5 - Math.random());

      const question = Question.create(
        randomUUID(),
        quizId,
        word.id,
        QuestionType.MULTIPLE_CHOICE,
        `What is the word for: "${definition}"?`,
        shuffledOptions,
        correctAnswer,
      );

      quiz.addQuestion(question);
    }

    await this.quizRepo.save(quiz);
    return quizId;
  }
}
