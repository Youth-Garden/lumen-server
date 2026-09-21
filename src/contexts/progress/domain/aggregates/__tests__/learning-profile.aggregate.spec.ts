import { LearningProfile } from '../learning-profile.aggregate';

describe('LearningProfile Aggregate', () => {
  const mockUserId = 'user-uuid-999';

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-09-01T04:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('create', () => {
    it('should initialize a fresh profile with 0 streak, 0 points, and 15 min daily goal', () => {
      const profile = LearningProfile.create(mockUserId);

      expect(profile.id).toBe(mockUserId);
      expect(profile.currentStreak).toBe(0);
      expect(profile.points).toBe(0);
      expect(profile.dailyGoalMinutes).toBe(15);
      expect(profile.streakFreezes).toBe(0);
      expect(profile.unlockedBadges).toEqual([]);
    });
  });

  describe('recordActivity & Streak Logic', () => {
    it('should start streak at 1 on first activity and grant FIRST_BLOOD badge', () => {
      const profile = LearningProfile.create(mockUserId);
      const activityDate = new Date('2026-09-01T04:00:00Z');

      profile.recordActivity(50, activityDate);

      expect(profile.points).toBe(50);
      expect(profile.currentStreak).toBe(1);
      expect(profile.lastActivity).toEqual(activityDate);
      expect(profile.unlockedBadges).toContain('FIRST_BLOOD');
    });

    it('should increment streak on consecutive days', () => {
      const profile = LearningProfile.create(mockUserId);

      // Day 1
      jest.setSystemTime(new Date('2026-09-01T04:00:00Z'));
      profile.recordActivity(10, new Date('2026-09-01T04:00:00Z'));
      expect(profile.currentStreak).toBe(1);

      // Day 2
      jest.setSystemTime(new Date('2026-09-02T04:00:00Z'));
      profile.recordActivity(10, new Date('2026-09-02T04:00:00Z'));
      expect(profile.currentStreak).toBe(2);

      // Day 3
      jest.setSystemTime(new Date('2026-09-03T04:00:00Z'));
      profile.recordActivity(10, new Date('2026-09-03T04:00:00Z'));
      expect(profile.currentStreak).toBe(3);
      expect(profile.unlockedBadges).toContain('STREAK_3_DAYS');
    });

    it('should maintain streak count if activity occurs multiple times on the same day', () => {
      const profile = LearningProfile.create(mockUserId);
      const morning = new Date('2026-09-01T02:00:00Z');
      const noon = new Date('2026-09-01T06:00:00Z');

      jest.setSystemTime(morning);
      profile.recordActivity(20, morning);

      jest.setSystemTime(noon);
      profile.recordActivity(30, noon);

      expect(profile.currentStreak).toBe(1);
      expect(profile.points).toBe(50);
    });

    it('should consume streak freeze when missing 1 day if freeze is available', () => {
      const profile = LearningProfile.reconstitute(
        mockUserId,
        5,
        new Date('2026-09-01T04:00:00Z'),
        300,
        15,
        2, // 2 freezes
      );

      // Missed Sept 2, active on Sept 3
      jest.setSystemTime(new Date('2026-09-03T04:00:00Z'));
      profile.recordActivity(20, new Date('2026-09-03T04:00:00Z'));

      expect(profile.currentStreak).toBe(6);
      expect(profile.streakFreezes).toBe(2);
    });

    it('should reset streak to 1 if missed days exceed available freezes', () => {
      const profile = LearningProfile.reconstitute(
        mockUserId,
        10,
        new Date('2026-09-01T04:00:00Z'),
        300,
        15,
        0, // 0 freezes
      );

      // Missed 3 days
      jest.setSystemTime(new Date('2026-09-05T04:00:00Z'));
      profile.recordActivity(20, new Date('2026-09-05T04:00:00Z'));

      expect(profile.currentStreak).toBe(1);
    });
  });

  describe('buyStreakFreeze & Points Badges', () => {
    it('should deduct points when purchasing streak freeze with sufficient points', () => {
      const profile = LearningProfile.reconstitute(
        mockUserId,
        2,
        new Date('2026-09-01T04:00:00Z'),
        1200,
        15,
        0,
      );

      const success = profile.buyStreakFreeze(500);

      expect(success).toBe(true);
      expect(profile.points).toBe(700);
      expect(profile.streakFreezes).toBe(1);
    });

    it('should reject purchase when points are insufficient', () => {
      const profile = LearningProfile.reconstitute(
        mockUserId,
        2,
        new Date('2026-09-01T04:00:00Z'),
        300,
        15,
        0,
      );

      const success = profile.buyStreakFreeze(500);

      expect(success).toBe(false);
      expect(profile.points).toBe(300);
      expect(profile.streakFreezes).toBe(0);
    });

    it('should unlock XP badges upon reaching point thresholds', () => {
      const profile = LearningProfile.create(mockUserId);

      profile.recordActivity(1200, new Date('2026-09-01T04:00:00Z'));
      expect(profile.unlockedBadges).toContain('XP_1000');
      expect(profile.unlockedBadges).not.toContain('XP_5000');

      profile.recordActivity(4000, new Date('2026-09-02T04:00:00Z'));
      expect(profile.unlockedBadges).toContain('XP_5000');
    });
  });
});
