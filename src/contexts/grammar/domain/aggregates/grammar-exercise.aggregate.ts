import { AggregateRoot } from '@nestjs/cqrs';

export class GrammarExercise extends AggregateRoot {
  private constructor(
    private readonly _id: string,
    private readonly _lessonId: string,
    private _questionText: string,
    private _options: string[],
    private _correctAnswer: string,
    private _explanation: string,
  ) {
    super();
  }

  static create(
    id: string,
    lessonId: string,
    questionText: string,
    options: string[],
    correctAnswer: string,
    explanation: string,
  ): GrammarExercise {
    return new GrammarExercise(
      id,
      lessonId,
      questionText,
      options,
      correctAnswer,
      explanation,
    );
  }

  static restore(
    id: string,
    lessonId: string,
    questionText: string,
    options: string[],
    correctAnswer: string,
    explanation: string,
  ): GrammarExercise {
    return new GrammarExercise(
      id,
      lessonId,
      questionText,
      options,
      correctAnswer,
      explanation,
    );
  }

  get id(): string {
    return this._id;
  }

  get lessonId(): string {
    return this._lessonId;
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

  get explanation(): string {
    return this._explanation;
  }

  public validateAnswer(answer: string): boolean {
    return this._correctAnswer === answer;
  }
}
