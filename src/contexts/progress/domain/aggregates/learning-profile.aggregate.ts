export class LearningProfile {
  private constructor(
    private readonly userId: string,
    private streak: number,
    private lastActivityDate: Date | null,
    private totalPoints: number,
  ) {}

  static create(userId: string): LearningProfile {
    return new LearningProfile(userId, 0, null, 0);
  }

  static reconstitute(
    userId: string,
    streak: number,
    lastActivityDate: Date | null,
    totalPoints: number,
  ): LearningProfile {
    return new LearningProfile(userId, streak, lastActivityDate, totalPoints);
  }

  get id(): string {
    return this.userId;
  }

  get currentStreak(): number {
    return this.streak;
  }

  get lastActivity(): Date | null {
    return this.lastActivityDate;
  }

  get points(): number {
    return this.totalPoints;
  }

  public recordActivity(points: number, activityDate: Date = new Date()) {
    this.totalPoints += points;

    if (!this.lastActivityDate) {
      this.streak = 1;
      this.lastActivityDate = activityDate;
      return;
    }

    const lastDate = new Date(
      this.lastActivityDate.getFullYear(),
      this.lastActivityDate.getMonth(),
      this.lastActivityDate.getDate(),
    );
    const currentDate = new Date(
      activityDate.getFullYear(),
      activityDate.getMonth(),
      activityDate.getDate(),
    );

    const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day
      this.streak += 1;
      this.lastActivityDate = activityDate;
    } else if (diffDays > 1) {
      // Missed a day
      this.streak = 1;
      this.lastActivityDate = activityDate;
    }
    // If diffDays === 0, it means activity on the same day, streak remains the same, update lastActivityDate
    else {
      this.lastActivityDate = activityDate;
    }
  }
}
