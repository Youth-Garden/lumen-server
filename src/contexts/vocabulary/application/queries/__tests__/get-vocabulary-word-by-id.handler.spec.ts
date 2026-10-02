import { Test, TestingModule } from '@nestjs/testing';
import { GetVocabularyWordByIdHandler } from '../get-vocabulary-word-by-id.handler';
import { GetVocabularyWordByIdQuery } from '../get-vocabulary-word-by-id.query';
import { VOCABULARY_WORD_REPOSITORY } from '../../../domain/repositories/vocabulary-word.repository.interface';
import { VocabularyWord } from '../../../domain/aggregates/vocabulary-word.aggregate';
import { VocabularyDefinition } from '../../../domain/entities/vocabulary-definition.entity';
import { VocabularyWordRelation } from '../../../domain/entities/vocabulary-word-relation.entity';
import { WordRelationType } from '../../../infrastructure/entities/word-relation.entity';
import { AppException } from '../../../../../shared/domain/exceptions';
import { VocabEx } from '../../../domain/exceptions/vocabulary.exception';

describe('GetVocabularyWordByIdHandler', () => {
  let handler: GetVocabularyWordByIdHandler;

  const mockRepository = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetVocabularyWordByIdHandler,
        {
          provide: VOCABULARY_WORD_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    handler = module.get<GetVocabularyWordByIdHandler>(
      GetVocabularyWordByIdHandler,
    );
    jest.clearAllMocks();
  });

  it('should throw WordNotFound if repository returns null', async () => {
    mockRepository.findById.mockResolvedValue(null);

    const query = new GetVocabularyWordByIdQuery('non-existent-id');

    await expect(handler.execute(query)).rejects.toThrow(
      new AppException(VocabEx.WordNotFound),
    );
  });

  it('should return VocabularyWordResponseDto with mapped sense and word-level relations', async () => {
    const def = new VocabularyDefinition('def-1', 'adjective', {
      en: 'Low in price',
    });
    const senseRelation = new VocabularyWordRelation(
      'rel-1',
      'word-1',
      'def-1',
      'word-2',
      'cheap',
      WordRelationType.SYNONYM,
      0,
    );
    def.addRelation(senseRelation);

    const wordRelation = new VocabularyWordRelation(
      'rel-2',
      'word-1',
      null,
      'word-3',
      'budget deficit',
      WordRelationType.RELATED,
      1,
    );

    const wordAggregate = VocabularyWord.restore(
      'word-1',
      'budget',
      '/ˈbʌdʒ.ɪt/',
      'https://audio.com/budget.mp3',
      'B1',
      [def],
      'https://image.com/budget.jpg',
      'https://audio.com/us.mp3',
      'https://audio.com/uk.mp3',
      '/ˈbʌdʒ.ɪt/',
      '/ˈbʌdʒ.ɪt/',
      [wordRelation],
    );

    mockRepository.findById.mockResolvedValue(wordAggregate);

    const query = new GetVocabularyWordByIdQuery('word-1');
    const result = await handler.execute(query);

    expect(result.id).toBe('word-1');
    expect(result.term).toBe('budget');
    expect(result.definitions).toHaveLength(1);
    expect(result.definitions[0].relations).toHaveLength(1);
    expect(result.definitions[0].relations[0]).toEqual({
      id: 'rel-1',
      sourceWordId: 'word-1',
      definitionId: 'def-1',
      targetWordId: 'word-2',
      targetTerm: 'cheap',
      relationType: WordRelationType.SYNONYM,
      displayOrder: 0,
    });

    expect(result.relations).toHaveLength(1);
    expect(result.relations[0]).toEqual({
      id: 'rel-2',
      sourceWordId: 'word-1',
      definitionId: null,
      targetWordId: 'word-3',
      targetTerm: 'budget deficit',
      relationType: WordRelationType.RELATED,
      displayOrder: 1,
    });
  });
});
