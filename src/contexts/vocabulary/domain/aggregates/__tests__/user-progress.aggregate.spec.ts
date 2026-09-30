import { UserProgress } from '../user-progress.aggregate';
import { SRS_CONFIG } from '../../constants/user-progress.constants';

describe('UserProgress Aggregate', () => {
  const mockUserId = 'user-123';
  const mockFlashcardId = 'card-456';

  describe('create', () => {
    it('should create initial user progress with level 0 and 0 score', () => {
      const progress = UserProgress.create(mockUserId, mockFlashcardId);

      expect(progress.id).toBeDefined();
      expect(progress.userId).toBe(mockUserId);
      expect(progress.flashcardId).toBe(mockFlashcardId);
      expect(progress.level).toBe(0);
      expect(progress.learningStep).toBe(0);
      expect(progress.masteryScore).toBe(0);
      expect(progress.isWilted).toBe(false);
      expect(progress.nextReviewAt).toBeNull();
    });
  });

  describe('reviewCorrect with Fast Track', () => {
    it('should jump to level 5 and score 100 when FAST_TRACK_KNOWN is applied', () => {
      const progress = UserProgress.create(mockUserId, mockFlashcardId);

      progress.reviewCorrect(true, false);

      expect(progress.level).toBe(SRS_CONFIG.FAST_TRACK.KNOWN.level);
      expect(progress.masteryScore).toBe(
        SRS_CONFIG.FAST_TRACK.KNOWN.masteryScore,
      );
      expect(progress.intervalDays).toBe(
        SRS_CONFIG.FAST_TRACK.KNOWN.intervalDays,
      );
      expect(progress.nextReviewAt).not.toBeNull();
    });

    it('should jump to level 2 when FAST_TRACK_TEMP is applied', () => {
      const progress = UserProgress.create(mockUserId, mockFlashcardId);

      progress.reviewCorrect(false, true);

      expect(progress.level).toBe(SRS_CONFIG.FAST_TRACK.TEMP_MEMORY.level);
      expect(progress.masteryScore).toBe(
        SRS_CONFIG.FAST_TRACK.TEMP_MEMORY.masteryScore,
      );
      expect(progress.intervalDays).toBe(
        SRS_CONFIG.FAST_TRACK.TEMP_MEMORY.intervalDays,
      );
    });
  });

  describe('reviewCorrect step progression from Level 0', () => {
    it('should increment learning steps on standard correct review', () => {
      const progress = UserProgress.create(mockUserId, mockFlashcardId);

      progress.reviewCorrect();
      expect(progress.learningStep).toBe(1);
      expect(progress.level).toBe(0);

      // Advance through all steps to graduate
      for (let i = 2; i <= SRS_CONFIG.LEARNING_STEPS_TO_GRADUATE; i++) {
        progress.reviewCorrect();
      }

      expect(progress.level).toBe(1);
      expect(progress.masteryScore).toBe(SRS_CONFIG.LEVEL_0_MAX_MASTERY_SCORE);
    });
  });

  describe('reviewWrong penalty', () => {
    it('should penalize mastery score and reset current level review count', () => {
      const progress = UserProgress.restore(
        'prog-1',
        mockUserId,
        mockFlashcardId,
        60,
        3,
        false,
        0,
        2,
        3,
        new Date(),
        new Date(),
      );

      progress.reviewWrong();

      expect(progress.masteryScore).toBe(
        60 - SRS_CONFIG.WRONG_ANSWER_SCORE_PENALTY,
      );
      expect(progress.reviewCountAtCurrentLevel).toBe(0);
      expect(progress.nextReviewAt).not.toBeNull();
    });
  });

  describe('resetToUnlearned', () => {
    it('should reset all progress fields back to 0', () => {
      const progress = UserProgress.restore(
        'prog-1',
        mockUserId,
        mockFlashcardId,
        80,
        4,
        false,
        0,
        2,
        7,
        new Date(),
        new Date(),
      );

      progress.resetToUnlearned();

      expect(progress.level).toBe(0);
      expect(progress.learningStep).toBe(0);
      expect(progress.masteryScore).toBe(0);
      expect(progress.intervalDays).toBe(0);
      expect(progress.nextReviewAt).toBeNull();
    });
  });
});
