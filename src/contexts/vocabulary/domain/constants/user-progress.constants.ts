export interface LevelPromotionRule {
  readonly requiredReviews: number;
  readonly nextLevel: number;
  readonly nextMasteryScore: number;
  readonly nextIntervalDays: number;
}

export const SRS_CONFIG = {
  MIN_MASTERY_SCORE: 0,
  MAX_MASTERY_SCORE: 100,
  SCORE_PER_LEVEL: 20,
  WRONG_ANSWER_SCORE_PENALTY: 20,
  DEFAULT_REVIEW_INTERVAL_HOURS: 4,
  DEFAULT_HOURLY_INTERVAL_DAYS: 0.16,
  MAX_INTERVAL_DAYS: 180,
  LEVEL_5_INTERVAL_MULTIPLIER: 2,

  LEARNING_STEPS_TO_GRADUATE: 6,
  LEVEL_0_MAX_MASTERY_SCORE: 20,

  FAST_TRACK: {
    KNOWN: {
      level: 5,
      masteryScore: 100,
      intervalDays: 30,
    },
    TEMP_MEMORY: {
      level: 2,
      masteryScore: 40,
      intervalDays: 1,
    },
  },
} as const;

export const LEVEL_PROMOTION_RULES: Readonly<
  Record<number, LevelPromotionRule>
> = {
  1: {
    requiredReviews: 2,
    nextLevel: 2,
    nextMasteryScore: 40,
    nextIntervalDays: 1,
  },
  2: {
    requiredReviews: 2,
    nextLevel: 3,
    nextMasteryScore: 60,
    nextIntervalDays: 3,
  },
  3: {
    requiredReviews: 1,
    nextLevel: 4,
    nextMasteryScore: 80,
    nextIntervalDays: 7,
  },
  4: {
    requiredReviews: 1,
    nextLevel: 5,
    nextMasteryScore: 100,
    nextIntervalDays: 30,
  },
};
