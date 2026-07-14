export class ExamAnswer {
  constructor(
    public readonly questionId: string,
    public userAnswer: string,
    public isCorrect: boolean | null,
    public timeSpent: number = 0,
    public flaggedHard: boolean = false,
  ) {}

  updateAnswer(newAnswer: string, timeSpent?: number, flaggedHard?: boolean): void {
    this.userAnswer = newAnswer;
    if (timeSpent !== undefined) {
      this.timeSpent = timeSpent;
    }
    if (flaggedHard !== undefined) {
      this.flaggedHard = flaggedHard;
    }
  }

  mark(isCorrect: boolean): void {
    this.isCorrect = isCorrect;
  }
}
