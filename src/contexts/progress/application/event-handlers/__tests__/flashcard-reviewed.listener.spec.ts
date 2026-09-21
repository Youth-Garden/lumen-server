jest.mock('uuid', () => ({
  v4: () => 'mock-uuid-1234',
}));

import { Test, TestingModule } from '@nestjs/testing';
import { FlashcardReviewedListener } from '../flashcard-reviewed.listener';
import { LEARNING_PROFILE_REPOSITORY } from '../../../domain/repositories/learning-profile.repository.interface';
import { ACTIVITY_REPOSITORY } from '../../../domain/repositories/activity.repository.interface';
import { LearningProfile } from '../../../domain/aggregates/learning-profile.aggregate';
import { FlashcardReviewedEvent } from '../../../../../shared/domain/events/flashcard-reviewed.event';

describe('FlashcardReviewedListener', () => {
  let listener: FlashcardReviewedListener;
  const mockProfileRepo = {
    findByUserId: jest.fn(),
    save: jest.fn(),
  };
  const mockActivityRepo = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlashcardReviewedListener,
        {
          provide: LEARNING_PROFILE_REPOSITORY,
          useValue: mockProfileRepo,
        },
        {
          provide: ACTIVITY_REPOSITORY,
          useValue: mockActivityRepo,
        },
      ],
    }).compile();

    listener = module.get<FlashcardReviewedListener>(FlashcardReviewedListener);
    jest.clearAllMocks();
  });

  it('should create new profile if not exists, record activity, and save profile and activity', async () => {
    mockProfileRepo.findByUserId.mockResolvedValue(null);
    mockProfileRepo.save.mockImplementation((p) => Promise.resolve(p));
    mockActivityRepo.save.mockResolvedValue(undefined);

    const event = new FlashcardReviewedEvent('user-123', 'card-456', 5);
    await listener.handle(event);

    expect(mockProfileRepo.findByUserId).toHaveBeenCalledWith('user-123');
    expect(mockProfileRepo.save).toHaveBeenCalled();
    expect(mockActivityRepo.save).toHaveBeenCalled();
  });

  it('should update existing profile when profile already exists', async () => {
    const existingProfile = LearningProfile.create('user-123');
    mockProfileRepo.findByUserId.mockResolvedValue(existingProfile);
    mockProfileRepo.save.mockImplementation((p) => Promise.resolve(p));
    mockActivityRepo.save.mockResolvedValue(undefined);

    const event = new FlashcardReviewedEvent('user-123', 'card-456', 1);
    await listener.handle(event);

    expect(mockProfileRepo.findByUserId).toHaveBeenCalledWith('user-123');
    expect(existingProfile.points).toBe(1);
    expect(mockProfileRepo.save).toHaveBeenCalledWith(existingProfile);
  });
});
