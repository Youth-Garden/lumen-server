import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { BatchReviewFlashcardsHandler } from '../batch-review-flashcards.handler';
import { BatchReviewFlashcardsCommand } from '../batch-review-flashcards.command';
import { USER_PROGRESS_REPOSITORY } from '../../../domain/repositories/user-progress.repository.interface';
import { FLASHCARD_REPOSITORY } from '../../../domain/repositories/flashcard.repository.interface';

describe('BatchReviewFlashcardsHandler', () => {
  let handler: BatchReviewFlashcardsHandler;

  const mockFlashcardRepo = {
    findManyByIds: jest.fn(),
  };

  const mockProgressRepo = {
    findManyByUserAndFlashcards: jest.fn(),
    save: jest.fn(),
  };

  const mockEventBus = {
    publish: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BatchReviewFlashcardsHandler,
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

    handler = module.get<BatchReviewFlashcardsHandler>(
      BatchReviewFlashcardsHandler,
    );
    jest.clearAllMocks();
  });

  it('should do nothing if reviews list is empty', async () => {
    const command = new BatchReviewFlashcardsCommand([], 'user-123');

    await handler.execute(command);

    expect(mockFlashcardRepo.findManyByIds).not.toHaveBeenCalled();
    expect(mockProgressRepo.findManyByUserAndFlashcards).not.toHaveBeenCalled();
    expect(mockProgressRepo.save).not.toHaveBeenCalled();
    expect(mockEventBus.publish).not.toHaveBeenCalled();
  });

  it('should process batch items, skip missing cards, save progress and publish events', async () => {
    const cardMap = new Map([
      ['card-valid-1', { id: 'card-valid-1' }],
      ['card-valid-2', { id: 'card-valid-2' }],
    ]);
    mockFlashcardRepo.findManyByIds.mockResolvedValue(cardMap);
    mockProgressRepo.findManyByUserAndFlashcards.mockResolvedValue(new Map());
    mockProgressRepo.save.mockResolvedValue(undefined);

    const command = new BatchReviewFlashcardsCommand(
      [
        {
          flashcardId: 'card-valid-1',
          isCorrect: true,
          isFastTrackKnown: false,
          isFastTrackTempMemory: false,
          isResetToUnlearned: false,
        },
        {
          flashcardId: 'card-missing',
          isCorrect: true,
          isFastTrackKnown: false,
          isFastTrackTempMemory: false,
          isResetToUnlearned: false,
        },
        {
          flashcardId: 'card-valid-2',
          isCorrect: false,
          isFastTrackKnown: false,
          isFastTrackTempMemory: false,
          isResetToUnlearned: false,
        },
      ],
      'user-123',
    );

    await handler.execute(command);

    expect(mockFlashcardRepo.findManyByIds).toHaveBeenCalledTimes(1);
    expect(mockProgressRepo.findManyByUserAndFlashcards).toHaveBeenCalledTimes(
      1,
    );
    // Only 2 valid cards should be saved
    expect(mockProgressRepo.save).toHaveBeenCalledTimes(2);
    expect(mockEventBus.publish).toHaveBeenCalledTimes(2);
  });
});
