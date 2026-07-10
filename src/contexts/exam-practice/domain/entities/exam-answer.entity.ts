export class ExamAnswer {
  constructor(
    public readonly questionId: string,
    public userAnswer: string,
    public isCorrect: boolean | null,
  ) {}

  updateAnswer(newAnswer: string): void {
    this.userAnswer = newAnswer;
  }

  mark(isCorrect: boolean): void {
    this.isCorrect = isCorrect;
  }
}
