export class LearningProfile {
  private constructor(
    private readonly userId: string,
    private streak: number,
    private lastActivityDate: Date | null,
    private totalPoints: number,
    private _dailyGoalMinutes: number,
    private _streakFreezes: number = 0,
    private _unlockedBadges: string[] = [],
    private _frozenDates: string[] = [],
  ) {}

  static create(userId: string): LearningProfile {
    return new LearningProfile(userId, 0, null, 0, 15, 0, [], []);
  }

  static reconstitute(
    userId: string,
    streak: number,
    lastActivityDate: Date | null,
    totalPoints: number,
    dailyGoalMinutes: number,
    streakFreezes: number,
    frozenDates: string[] = [],
  ): LearningProfile {
    return new LearningProfile(
      userId,
      streak,
      lastActivityDate,
      totalPoints,
      dailyGoalMinutes,
      streakFreezes,
      [],
      frozenDates,
    );
  }

  get id(): string {
    return this.userId;
  }

  get currentStreak(): number {
    if (this.streak <= 0) {
      return 0;
    }

    if (!this.lastActivityDate) {
      return this.streak;
    }

    const now = new Date();
    const lastDate = new Date(
      this.lastActivityDate.getFullYear(),
      this.lastActivityDate.getMonth(),
      this.lastActivityDate.getDate(),
    );
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffTime = today.getTime() - lastDate.getTime();
    if (diffTime < 0) {
      return Math.max(1, this.streak);
    }

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return Math.max(1, this.streak);
    }

    if (diffDays === 1) {
      return this.streak;
    }

    const missedDays = diffDays - 1;
    if (this._streakFreezes >= missedDays) {
      return this.streak;
    }

    return 0;
  }

  public syncStreak(
    now: Date = new Date(),
    hasActivityToday: boolean = false,
  ): boolean {
    let changed = false;

    if (hasActivityToday) {
      if (this.streak === 0) {
        this.streak = 1;
        changed = true;
      }
      if (!this.lastActivityDate) {
        this.lastActivityDate = now;
        changed = true;
      }
    }

    if (!this.lastActivityDate) {
      return changed;
    }

    const lastDate = new Date(
      this.lastActivityDate.getFullYear(),
      this.lastActivityDate.getMonth(),
      this.lastActivityDate.getDate(),
    );
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffTime = today.getTime() - lastDate.getTime();
    if (diffTime < 0) {
      return changed;
    }

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      if (this.streak === 0) {
        this.streak = 1;
        changed = true;
      }
      return changed;
    }

    if (diffDays > 1) {
      let availableFreezes = this._streakFreezes;

      const missedDays = diffDays - 1;
      const usedFreezes = Math.min(availableFreezes, missedDays);
      this._streakFreezes = Math.max(0, availableFreezes - usedFreezes);

      if (usedFreezes > 0) {
        for (let k = 1; k <= usedFreezes; k++) {
          const freezeDate = new Date(this.lastActivityDate.getTime());
          freezeDate.setDate(freezeDate.getDate() + k);
          this.recordFrozenDate(freezeDate);
        }
        const protectedDate = new Date(this.lastActivityDate.getTime());
        protectedDate.setDate(protectedDate.getDate() + usedFreezes);
        this.lastActivityDate = protectedDate;
      }

      if (usedFreezes < missedDays) {
        this.streak = 0;
        this._streakFreezes = 0;
      }

      changed = true;
      return changed;
    }

    return changed;
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

  get frozenDates(): string[] {
    return [...this._frozenDates];
  }

  private recordFrozenDate(date: Date) {
    const dStr = date.toISOString().slice(0, 10);
    if (!this._frozenDates.includes(dStr)) {
      this._frozenDates.push(dStr);
    }
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
    const MAX_STREAK_FREEZES = 5;

    if (!this.lastActivityDate || this.streak === 0) {
      this.streak = 1;
      this._streakFreezes = Math.max(this._streakFreezes, 1);
      this.lastActivityDate = activityDate;
      this.checkAndUnlockBadges();
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
      this._streakFreezes = Math.min(
        MAX_STREAK_FREEZES,
        this._streakFreezes + 1,
      );
      this.lastActivityDate = activityDate;
    } else if (diffDays > 1) {
      // Missed a day
      const missedDays = diffDays - 1;
      const usedFreezes = Math.min(this._streakFreezes, missedDays);
      this._streakFreezes -= usedFreezes;

      if (usedFreezes > 0) {
        for (let k = 1; k <= usedFreezes; k++) {
          const freezeDate = new Date(lastDate.getTime());
          freezeDate.setDate(freezeDate.getDate() + k);
          this.recordFrozenDate(freezeDate);
        }
      }

      if (usedFreezes >= missedDays) {
        // Used freeze to cover all missed days
        this.streak += 1;
        this._streakFreezes = Math.min(
          MAX_STREAK_FREEZES,
          this._streakFreezes + 1,
        );
      } else {
        // Streak lost (insufficient freezes)
        this.streak = 1;
        this._streakFreezes = 1;
      }
      this.lastActivityDate = activityDate;
    } else {
      // Same day
      if (this.streak === 0) {
        this.streak = 1;
      }
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
