export class LearningProfile {
  private constructor(
    private readonly userId: string,
    private streak: number,
    private lastActivityDate: Date | null,
    private totalPoints: number,
    private _dailyGoalMinutes: number,
    private _streakFreezes: number = 0,
    private _unlockedBadges: string[] = [],
  ) {}

  static create(userId: string): LearningProfile {
    return new LearningProfile(userId, 0, null, 0, 15, 0);
  }

  static reconstitute(
    userId: string,
    streak: number,
    lastActivityDate: Date | null,
    totalPoints: number,
    dailyGoalMinutes: number,
    streakFreezes: number,
  ): LearningProfile {
    return new LearningProfile(
      userId,
      streak,
      lastActivityDate,
      totalPoints,
      dailyGoalMinutes,
      streakFreezes,
      [],
    );
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

  get dailyGoalMinutes(): number {
    return this._dailyGoalMinutes;
  }

  get streakFreezes(): number {
    return this._streakFreezes;
  }

  get unlockedBadges(): string[] {
    return [...this._unlockedBadges];
  }

  public restoreBadges(badges: string[]) {
    this._unlockedBadges = [...badges];
  }

  private unlockBadge(badge: string): boolean {
    if (!this._unlockedBadges.includes(badge)) {
      this._unlockedBadges.push(badge);
      return true;
    }
    return false;
  }

  public updateSettings(dailyGoalMinutes: number): void {
    if (dailyGoalMinutes > 0) {
      this._dailyGoalMinutes = dailyGoalMinutes;
    }
  }

  public buyStreakFreeze(cost: number = 500): boolean {
    if (this.totalPoints < cost) {
      return false;
    }
    this.totalPoints -= cost;
    this._streakFreezes += 1;
    return true;
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
      this._streakFreezes += 1; // Gain 1 freeze for maintaining streak
      this.lastActivityDate = activityDate;
    } else if (diffDays > 1) {
      // Missed a day
      const missedDays = diffDays - 1;
      if (this._streakFreezes >= missedDays) {
        // Used freeze
        this._streakFreezes -= missedDays;
        this.streak += 1;
        this._streakFreezes += 1; // Gain 1 freeze for maintaining streak today
      } else {
        // Streak lost
        this.streak = 1;
        this._streakFreezes = 0; // Reset freezes when streak is lost (optional, but makes sense)
      }
      this.lastActivityDate = activityDate;
    }
    // If diffDays === 0, it means activity on the same day, streak remains the same, update lastActivityDate
    else {
      this.lastActivityDate = activityDate;
    }

    this.checkAndUnlockBadges();
  }

  private checkAndUnlockBadges() {
    // Check points badges
    if (this.totalPoints >= 1000) this.unlockBadge('XP_1000');
    if (this.totalPoints >= 5000) this.unlockBadge('XP_5000');

    // Check streak badges
    if (this.streak >= 3) this.unlockBadge('STREAK_3_DAYS');
    if (this.streak >= 7) this.unlockBadge('STREAK_7_DAYS');
    if (this.streak >= 30) this.unlockBadge('STREAK_30_DAYS');

    // FIRST_BLOOD
    if (this.totalPoints > 0) this.unlockBadge('FIRST_BLOOD');
  }
}
