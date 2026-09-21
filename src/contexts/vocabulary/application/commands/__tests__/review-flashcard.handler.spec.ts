import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { ReviewFlashcardHandler } from '../review-flashcard.handler';
import { ReviewFlashcardCommand } from '../review-flashcard.command';
import { USER_PROGRESS_REPOSITORY } from '../../../domain/repositories/user-progress.repository.interface';
import { FLASHCARD_REPOSITORY } from '../../../domain/repositories/flashcard.repository.interface';
import { UserProgress } from '../../../domain/aggregates/user-progress.aggregate';
import { AppException } from '../../../../../shared/domain/exceptions';
import { VocabEx } from '../../../domain/exceptions/vocabulary.exception';

describe('ReviewFlashcardHandler', () => {
  let handler: ReviewFlashcardHandler;

  const mockFlashcardRepo = {
    findById: jest.fn(),
  };

  const mockProgressRepo = {
    findByUserAndFlashcard: jest.fn(),
    save: jest.fn(),
  };

  const mockEventBus = {
    publish: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewFlashcardHandler,
        {
          provide: FLASHCARD_REPOSITORY,
          useValue: mockFlashcardRepo,
        },
        {
          provide: USER_PROGRESS_REPOSITORY,
          useValue: mockProgressRepo,
        },
        {
          provide: EventBus,
          useValue: mockEventBus,
        },
      ],
    }).compile();

    handler = module.get<ReviewFlashcardHandler>(ReviewFlashcardHandler);
    jest.clearAllMocks();
  });

  it('should throw FlashcardNotFound exception when flashcard does not exist', async () => {
    mockFlashcardRepo.findById.mockResolvedValue(null);

    const command = new ReviewFlashcardCommand(
      'card-invalid',
      true,
      false,
      false,
      false,
      'user-123',
    );

    await expect(handler.execute(command)).rejects.toThrow(
      new AppException(VocabEx.FlashcardNotFound),
    );
  });

  it('should create new progress, apply correct review, and publish domain event', async () => {
    mockFlashcardRepo.findById.mockResolvedValue({ id: 'card-1' });
    mockProgressRepo.findByUserAndFlashcard.mockResolvedValue(null);
    mockProgressRepo.save.mockResolvedValue(undefined);

    const command = new ReviewFlashcardCommand(
      'card-1',
      true,
      false,
      false,
      false,
      'user-123',
    );

    await handler.execute(command);

    expect(mockProgressRepo.save).toHaveBeenCalledTimes(1);
    expect(mockEventBus.publish).toHaveBeenCalledTimes(1);
    expect(mockProgressRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-123',
        flashcardId: 'card-1',
      }),
    );
  });

  it('should reset progress when isResetToUnlearned is true', async () => {
    const existingProgress = UserProgress.restore(
      'prog-1',
      'user-123',
      'card-1',
      80,
      4,
      false,
      0,
      2,
      7,
      new Date(),
      new Date(),
    );

    mockFlashcardRepo.findById.mockResolvedValue({ id: 'card-1' });
    mockProgressRepo.findByUserAndFlashcard.mockResolvedValue(existingProgress);
    mockProgressRepo.save.mockResolvedValue(undefined);

    const command = new ReviewFlashcardCommand(
      'card-1',
      false,
      false,
      false,
      true,
      'user-123',
    );

    await handler.execute(command);

    expect(existingProgress.level).toBe(0);
    expect(existingProgress.masteryScore).toBe(0);
    expect(mockProgressRepo.save).toHaveBeenCalledWith(existingProgress);
  });
});
