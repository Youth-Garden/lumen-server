import { VocabularyEnricherService } from '../vocabulary-enricher.service';

describe('VocabularyEnricherService Unit Tests', () => {
  let enricher: VocabularyEnricherService;

  beforeEach(() => {
    enricher = new VocabularyEnricherService();
  });

  it('instantiates correctly and exposes methods', () => {
    expect(enricher).toBeDefined();
    expect(typeof enricher.fetchImage).toBe('function');
    expect(typeof enricher.translate).toBe('function');
    expect(typeof enricher.fetchDictionaryMetadata).toBe('function');
    expect(typeof enricher.enrichFullWord).toBe('function');
  });

  it('fallback translation returns original text if all providers return null', async () => {
    const provider = (
      enricher as unknown as {
        translationProvider: { translate: () => Promise<string | null> };
      }
    ).translationProvider;
    jest.spyOn(provider, 'translate').mockResolvedValue(null);
    const res = await enricher.translate('hello', 'vi');
    expect(res).toBe('hello');
  });

  it('enrichFullWord combines image, dictionary metadata, and translation', async () => {
    jest
      .spyOn(enricher, 'fetchAndUploadWebpImage')
      .mockResolvedValue('https://res.cloudinary.com/test/image.webp');
    jest.spyOn(enricher, 'fetchDictionaryMetadata').mockResolvedValue({
      phoneticUs: '/ˈæp.əl/',
      phoneticUk: '/ˈæp.əl/',
      audioUsUrl: 'https://cdn.com/us.mp3',
      audioUkUrl: 'https://cdn.com/uk.mp3',
      enDef: 'A red fruit',
      pos: 'noun',
      enExample: 'Eat an apple.',
    });
    jest.spyOn(enricher, 'translate').mockImplementation((text) => {
      if (text === 'A red fruit') return Promise.resolve('Quả táo màu đỏ');
      if (text === 'Eat an apple.') return Promise.resolve('Ăn một quả táo.');
      return Promise.resolve(text);
    });

    const result = await enricher.enrichFullWord('apple');
    expect(result).toEqual({
      term: 'apple',
      phoneticUs: '/ˈæp.əl/',
      phoneticUk: '/ˈæp.əl/',
      audioUsUrl: 'https://cdn.com/us.mp3',
      audioUkUrl: 'https://cdn.com/uk.mp3',
      imageUrl: 'https://res.cloudinary.com/test/image.webp',
      partOfSpeech: 'noun',
      definitionEn: 'A red fruit',
      definitionVi: 'Quả táo màu đỏ',
      exampleEn: 'Eat an apple.',
      exampleVi: 'Ăn một quả táo.',
    });
  });
});
