import { QuizStatus } from '../enums/quiz.enum';
import { Question } from '../entities/question.entity';
import { AggregateRoot } from '@nestjs/cqrs';
import { QuizGeneratedEvent } from '../events/quiz-generated.event';
import { QuizFinishedEvent } from '../events/quiz-finished.event';

export class Quiz extends AggregateRoot {
  private constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private _status: QuizStatus,
    private _score: number,
    private readonly _questions: Question[],
    private readonly _createdAt: Date,
    private _completedAt: Date | null,
  ) {
    super();
  }

  static create(id: string, userId: string): Quiz {
    const quiz = new Quiz(
      id,
      userId,
      QuizStatus.IN_PROGRESS,
      0,
      [],
      new Date(),
      null,
    );
    quiz.apply(new QuizGeneratedEvent(id, userId));
    return quiz;
  }

  static restore(
    id: string,
    userId: string,
    status: QuizStatus,
    score: number,
    questions: Question[],
    createdAt: Date,
    completedAt: Date | null,
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

    const question = this._questions.find((quest) => quest.id === questionId);
    if (!question) {
      throw new Error('Question not found in this quiz');
    }

    question.submitAnswer(answer);
  }

  finish(): void {
    if (this._status === QuizStatus.COMPLETED) {
      throw new Error('Quiz is already completed');
    }

    const allAnswered = this._questions.every(
      (quest) => quest.userAnswer !== null,
    );
    if (!allAnswered) {
      throw new Error('Cannot finish quiz with unanswered questions');
    }

    const correctCount = this._questions.filter(
      (quest) => quest.isCorrect,
    ).length;
    // Score based on percentage
    this._score =
      this._questions.length > 0
        ? (correctCount / this._questions.length) * 100
        : 0;
    this._status = QuizStatus.COMPLETED;
    this._completedAt = new Date();

    this.apply(new QuizFinishedEvent(this._id, this._userId, this._score));
  }
}
