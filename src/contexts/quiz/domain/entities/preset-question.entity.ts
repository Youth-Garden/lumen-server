import { QuestionType } from '../enums/quiz.enum';

export class PresetQuestion {
  private constructor(
    private readonly _id: string,
    private readonly _quizId: string,
    private readonly _type: QuestionType,
    private readonly _questionText: string,
    private readonly _options: string[], // JSON array of answers
    private readonly _correctAnswer: string,
  ) {}

  static create(
    id: string,
    quizId: string,
    type: QuestionType,
    questionText: string,
    options: string[],
    correctAnswer: string,
  ): PresetQuestion {
    return new PresetQuestion(
      id,
      quizId,
      type,
      questionText,
      options,
      correctAnswer,
    );
  }

  get id(): string {
    return this._id;
  }
  get quizId(): string {
    return this._quizId;
  }
  get type(): QuestionType {
    return this._type;
  }
  get questionText(): string {
    return this._questionText;
  }
  get options(): string[] {
    return this._options;
  }
  get correctAnswer(): string {
    return this._correctAnswer;
  }
}
