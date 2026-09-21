import { VocabularyWord } from '../vocabulary-word.aggregate';
import { VocabularyDefinition } from '../../entities/vocabulary-definition.entity';

describe('VocabularyWord Aggregate', () => {
  const mockDefinition = new VocabularyDefinition('def-1', 'noun', {
    en: 'A fruit',
    vi: 'Một loại quả',
  });

  describe('create & restore', () => {
    it('should create a new vocabulary word aggregate with all properties', () => {
      const word = VocabularyWord.create(
        'Apple',
        '/ˈæp.əl/',
        'https://audio.com/apple.mp3',
        'A1',
        [mockDefinition],
        'https://img.com/apple.png',
        'https://audio.com/apple_us.mp3',
        'https://audio.com/apple_uk.mp3',
        '/ˈæp.əl/',
        '/ˈæp.əl/',
      );

      expect(word.id).toBeDefined();
      expect(word.term).toBe('Apple');
      expect(word.phonetic).toBe('/ˈæp.əl/');
      expect(word.definitions).toHaveLength(1);
      expect(word.definitions[0].partOfSpeech).toBe('noun');
      expect(word.audioUsUrl).toBe('https://audio.com/apple_us.mp3');
      expect(word.audioUkUrl).toBe('https://audio.com/apple_uk.mp3');
    });

    it('should restore an existing vocabulary word aggregate', () => {
      const existingId = 'word-uuid-123';
      const word = VocabularyWord.restore(
        existingId,
        'Banana',
        '/bəˈnɑː.nə/',
        null,
        'A1',
        [mockDefinition],
      );

      expect(word.id).toBe(existingId);
      expect(word.term).toBe('Banana');
      expect(word.cefrLevel).toBe('A1');
    });
  });

  describe('update', () => {
    it('should partially update properties without mutating unmodified fields', () => {
      const word = VocabularyWord.create('Orange', null, null, 'A2', [
        mockDefinition,
      ]);

      word.update('Orange (Fruit)', '/ˈɒr.ɪndʒ/');

      expect(word.term).toBe('Orange (Fruit)');
      expect(word.phonetic).toBe('/ˈɒr.ɪndʒ/');
      expect(word.cefrLevel).toBe('A2');
      expect(word.definitions).toHaveLength(1);
    });
  });
});
