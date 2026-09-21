import { Test, TestingModule } from '@nestjs/testing';
import { CreateVocabularyWordHandler } from '../create-vocabulary-word.handler';
import { CreateVocabularyWordCommand } from '../create-vocabulary-word.command';
import { VOCABULARY_WORD_REPOSITORY } from '../../../domain/repositories/vocabulary-word.repository.interface';
import { AppException } from '../../../../../shared/domain/exceptions';
import { VocabEx } from '../../../domain/exceptions/vocabulary.exception';

jest.mock('../../../infrastructure/helpers/dictionary-audio.helper', () => ({
  fetchDictionaryPronunciations: jest.fn().mockResolvedValue({
    audioUsUrl: 'https://audio.com/us.mp3',
    audioUkUrl: 'https://audio.com/uk.mp3',
    phoneticUs: '/ˈtest/',
    phoneticUk: '/ˈtest/',
    phoneticDefault: '/ˈtest/',
  }),
}));

describe('CreateVocabularyWordHandler', () => {
  let handler: CreateVocabularyWordHandler;

  const mockRepository = {
    findByTerm: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateVocabularyWordHandler,
        {
          provide: VOCABULARY_WORD_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    handler = module.get<CreateVocabularyWordHandler>(
      CreateVocabularyWordHandler,
    );
    jest.clearAllMocks();
  });

  it('should throw WordAlreadyExists if term already exists in repository', async () => {
    mockRepository.findByTerm.mockResolvedValue({
      id: 'word-1',
      term: 'apple',
    });

    const command = new CreateVocabularyWordCommand(
      'apple',
      null,
      null,
      'A1',
      [],
    );

    await expect(handler.execute(command)).rejects.toThrow(
      new AppException(VocabEx.WordAlreadyExists),
    );
  });

  it('should create new word with definitions and auto-enrich pronunciation if missing', async () => {
    mockRepository.findByTerm.mockResolvedValue(null);
    mockRepository.save.mockResolvedValue(undefined);

    const command = new CreateVocabularyWordCommand(
      'resilience',
      null,
      null,
      'C1',
      [
        {
          partOfSpeech: 'noun',
          definitionEn: 'The capacity to recover quickly from difficulties',
          translationVi: 'Khả năng phục hồi nhanh chóng',
          examples: [
            {
              sentenceEn: 'She showed great resilience.',
              translationVi: 'Cô ấy thể hiện sự kiên cường tuyệt vời.',
            },
          ],
        },
      ],
    );

    const wordId = await handler.execute(command);

    expect(wordId).toBeDefined();
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    expect(mockRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        term: 'resilience',
        cefrLevel: 'C1',
        audioUsUrl: 'https://audio.com/us.mp3',
      }),
    );
  });
});
