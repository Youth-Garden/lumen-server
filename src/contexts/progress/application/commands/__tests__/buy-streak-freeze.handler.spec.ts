import { Test, TestingModule } from '@nestjs/testing';
import { BuyStreakFreezeHandler } from '../buy-streak-freeze.handler';
import { LEARNING_PROFILE_REPOSITORY } from '../../../domain/repositories/learning-profile.repository.interface';
import { LearningProfile } from '../../../domain/aggregates/learning-profile.aggregate';
import { AppException } from '../../../../../shared/domain/exceptions/app.exception';

describe('BuyStreakFreezeHandler', () => {
  let handler: BuyStreakFreezeHandler;
  const mockProfileRepo = {
    findByUserId: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuyStreakFreezeHandler,
        {
          provide: LEARNING_PROFILE_REPOSITORY,
          useValue: mockProfileRepo,
        },
      ],
    }).compile();

    handler = module.get<BuyStreakFreezeHandler>(BuyStreakFreezeHandler);
    jest.clearAllMocks();
  });

  it('should throw AppException if profile has insufficient points', async () => {
    const profile = LearningProfile.create('user-1'); // 0 points
    mockProfileRepo.findByUserId.mockResolvedValue(profile);

    await expect(handler.execute({ userId: 'user-1' })).rejects.toThrow(
      AppException,
    );

    expect(mockProfileRepo.save).not.toHaveBeenCalled();
  });

  it('should deduct 500 points and increment streakFreezeCount when points are sufficient', async () => {
    const profile = LearningProfile.create('user-1');
    profile.recordActivity(600); // has 600 points
    mockProfileRepo.findByUserId.mockResolvedValue(profile);
    mockProfileRepo.save.mockImplementation((p) => Promise.resolve(p));

    await handler.execute({ userId: 'user-1' });

    expect(profile.points).toBe(100);
    expect(profile.streakFreezes).toBe(2);
    expect(mockProfileRepo.save).toHaveBeenCalledWith(profile);
  });
});
