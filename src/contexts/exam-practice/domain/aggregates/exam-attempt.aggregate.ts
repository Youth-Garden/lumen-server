import { AggregateRoot } from '@nestjs/cqrs';
import { ExamAttemptStatus, ExamType } from '../enums/exam.enum';
import { ExamAnswer } from '../entities/exam-answer.entity';
import { ExamAttemptCompletedEvent } from '../events/exam-attempt-completed.event';
import { AppException } from '../../../../common/exceptions/app.exception';
import { ExamPracticeEx } from '../exceptions/exam-practice.exception';

export class ExamAttempt extends AggregateRoot {
  private constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _testId: string,
    private readonly _testType: ExamType,
    private _status: ExamAttemptStatus,
    private _listeningScore: number,
    private _readingScore: number,
    private _totalScore: number,
    private readonly _startedAt: Date,
    private _completedAt: Date | null,
    private readonly _answers: ExamAnswer[],
  ) {
    super();
  }

  static start(
    id: string,
    userId: string,
    testId: string,
    testType: ExamType,
  ): ExamAttempt {
    return new ExamAttempt(
      id,
      userId,
      testId,
      testType,
      ExamAttemptStatus.IN_PROGRESS,
      0,
      0,
      0,
      new Date(),
      null,
      [],
    );
  }

  static restore(
    id: string,
    userId: string,
    testId: string,
    testType: ExamType,
    status: ExamAttemptStatus,
    listeningScore: number,
    readingScore: number,
    totalScore: number,
    startedAt: Date,
    completedAt: Date | null,
    answers: ExamAnswer[],
  ): ExamAttempt {
    return new ExamAttempt(
      id,
      userId,
      testId,
      testType,
      status,
      listeningScore,
      readingScore,
      totalScore,
      startedAt,
      completedAt,
      answers,
    );
  }

  get id(): string {
    return this._id;
  }
  get userId(): string {
    return this._userId;
  }
  get testId(): string {
    return this._testId;
  }
  get testType(): ExamType {
    return this._testType;
  }
  get status(): ExamAttemptStatus {
    return this._status;
  }
  get listeningScore(): number {
    return this._listeningScore;
  }
  get readingScore(): number {
    return this._readingScore;
  }
  get totalScore(): number {
    return this._totalScore;
  }
  get startedAt(): Date {
    return this._startedAt;
  }
  get completedAt(): Date | null {
    return this._completedAt;
  }
  get answers(): ExamAnswer[] {
    return this._answers;
  }

  submitAnswer(questionId: string, userAnswer: string): void {
    if (this._status === ExamAttemptStatus.COMPLETED) {
      throw new AppException(ExamPracticeEx.AttemptAlreadyCompleted);
    }

    const existingAnswer = this._answers.find(
      (a) => a.questionId === questionId,
    );
    if (existingAnswer) {
      existingAnswer.updateAnswer(userAnswer);
    } else {
      this._answers.push(new ExamAnswer(questionId, userAnswer, null));
    }
  }

  finish(
    correctAnswersMap: Map<string, { part: number; correctAnswer: string }>,
  ): void {
    if (this._status === ExamAttemptStatus.COMPLETED) {
      throw new AppException(ExamPracticeEx.AttemptAlreadyCompleted);
    }

    let listeningCorrectCount = 0;
    let readingCorrectCount = 0;

    // Grade answers
    for (const answer of this._answers) {
      const questionInfo = correctAnswersMap.get(answer.questionId);
      if (!questionInfo) continue;

      const isCorrect = questionInfo.correctAnswer === answer.userAnswer;
      answer.mark(isCorrect);

      if (isCorrect) {
        // TOEIC Listening: Parts 1-4
        if (questionInfo.part >= 1 && questionInfo.part <= 4) {
          listeningCorrectCount++;
        }
        // TOEIC Reading: Parts 5-7
        else if (questionInfo.part >= 5 && questionInfo.part <= 7) {
          readingCorrectCount++;
        }
      }
    }

    // Simplified TOEIC score calculation for MVP
    // Assuming each section has 100 questions. Scale 5-495.
    this._listeningScore = this.calculateSectionScore(listeningCorrectCount);
    this._readingScore = this.calculateSectionScore(readingCorrectCount);
    this._totalScore = this._listeningScore + this._readingScore;

    this._status = ExamAttemptStatus.COMPLETED;
    this._completedAt = new Date();

    this.apply(
      new ExamAttemptCompletedEvent(
        this._id,
        this._userId,
        this._testId,
        this._totalScore,
      ),
    );
  }

  private calculateSectionScore(correctCount: number): number {
    if (correctCount === 0) return 5;
    // Linear scale for MVP: 100 correct -> 495. (495 - 5) / 100 = 4.9.
    const score = 5 + Math.round(correctCount * 4.9);
    return score > 495 ? 495 : score;
  }
}
