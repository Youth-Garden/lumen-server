import { QuestionType } from '../enums/quiz.enum';

export class Question {
  private constructor(
    private readonly _id: string,
    private readonly _quizId: string,
    private readonly _wordId: string,
    private readonly _type: QuestionType,
    private readonly _questionText: string,
    private readonly _options: string[], // JSON array of answers
    private readonly _correctAnswer: string,
    private _userAnswer: string | null,
    private _isCorrect: boolean | null,
  ) {}

  static create(
    id: string,
    quizId: string,
    wordId: string,
    type: QuestionType,
    questionText: string,
    options: string[],
    correctAnswer: string,
    userAnswer: string | null = null,
    isCorrect: boolean | null = null,
  ): Question {
    return new Question(
      id,
      quizId,
      wordId,
      type,
      questionText,
      options,
      correctAnswer,
      userAnswer,
      isCorrect,
    );
  }

  get id(): string {
    return this._id;
  }
  get quizId(): string {
    return this._quizId;
  }
  get wordId(): string {
    return this._wordId;
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
  get userAnswer(): string | null {
    return this._userAnswer;
  }
  get isCorrect(): boolean | null {
    return this._isCorrect;
  }

  submitAnswer(answer: string): void {
    if (this._userAnswer !== null) {
      throw new Error('Question already answered');
    }
    this._userAnswer = answer;
    this._isCorrect = answer === this._correctAnswer;
  }
}
