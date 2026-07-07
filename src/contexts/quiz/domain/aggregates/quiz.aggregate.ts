import { QuizStatus } from '../enums/quiz.enum';
import { Question } from '../entities/question.entity';

export class Quiz {
  private constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private _status: QuizStatus,
    private _score: number,
    private readonly _questions: Question[],
    private readonly _createdAt: Date,
    private _completedAt: Date | null,
  ) {}

  static create(
    id: string,
    userId: string,
    status: QuizStatus = QuizStatus.IN_PROGRESS,
    score: number = 0,
    questions: Question[] = [],
    createdAt: Date = new Date(),
    completedAt: Date | null = null,
  ): Quiz {
    return new Quiz(
      id,
      userId,
      status,
      score,
      questions,
      createdAt,
      completedAt,
    );
  }

  get id(): string {
    return this._id;
  }
  get userId(): string {
    return this._userId;
  }
  get status(): QuizStatus {
    return this._status;
  }
  get score(): number {
    return this._score;
  }
  get questions(): Question[] {
    return this._questions;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get completedAt(): Date | null {
    return this._completedAt;
  }

  addQuestion(question: Question): void {
    this._questions.push(question);
  }

  submitAnswer(questionId: string, answer: string): void {
    if (this._status === QuizStatus.COMPLETED) {
      throw new Error('Quiz is already completed');
    }

    const question = this._questions.find((q) => q.id === questionId);
    if (!question) {
      throw new Error('Question not found in this quiz');
    }

    question.submitAnswer(answer);
  }

  finish(): void {
    if (this._status === QuizStatus.COMPLETED) {
      throw new Error('Quiz is already completed');
    }

    const allAnswered = this._questions.every((q) => q.userAnswer !== null);
    if (!allAnswered) {
      throw new Error('Cannot finish quiz with unanswered questions');
    }

    this._status = QuizStatus.COMPLETED;
    this._completedAt = new Date();

    const correctCount = this._questions.filter((q) => q.isCorrect).length;
    // Score based on percentage
    this._score =
      this._questions.length > 0
        ? (correctCount / this._questions.length) * 100
        : 0;
  }
}
