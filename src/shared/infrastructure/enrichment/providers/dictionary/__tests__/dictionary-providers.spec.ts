import axios from 'axios';
import { FreeDictionaryProvider } from '../free-dictionary.provider';
import { DatamuseDictionaryProvider } from '../datamuse-dictionary.provider';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Dictionary Providers Unit Tests', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('FreeDictionaryProvider', () => {
    it('fetches word metadata successfully', async () => {
      const provider = new FreeDictionaryProvider();
      expect(provider.isEnabled()).toBe(true);

      mockedAxios.get.mockResolvedValueOnce({
        data: [
          {
            phonetics: [
              {
                text: '/ˈæp.əl/',
                audio:
                  'https://api.dictionaryapi.dev/media/pronunciations/en/apple-us.mp3',
              },
            ],
            meanings: [
              {
                partOfSpeech: 'noun',
                definitions: [
                  {
                    definition: 'A round fruit with red or green skin.',
                    example: 'He ate an apple.',
                  },
                ],
              },
            ],
          },
        ],
      });

      const meta = await provider.fetchMetadata('apple');
      expect(meta).toEqual({
        phoneticUs: '/ˈæp.əl/',
        phoneticUk: null,
        audioUsUrl:
          'https://api.dictionaryapi.dev/media/pronunciations/en/apple-us.mp3',
        audioUkUrl: null,
        enDef: 'A round fruit with red or green skin.',
        pos: 'noun',
        enExample: 'He ate an apple.',
      });
    });

    it('returns null on error', async () => {
      const provider = new FreeDictionaryProvider();
      mockedAxios.get.mockRejectedValueOnce(new Error('404 Not Found'));

      const meta = await provider.fetchMetadata('unknownword');
      expect(meta).toBeNull();
    });
  });

  describe('DatamuseDictionaryProvider', () => {
    it('fetches metadata and converts arpabet to IPA', async () => {
      const provider = new DatamuseDictionaryProvider();
      expect(provider.isEnabled()).toBe(true);

      mockedAxios.get.mockResolvedValueOnce({
        data: [
          {
            word: 'apple',
            defs: ['n\tA common round fruit'],
            tags: ['pron:AE1 P AH0 L'],
          },
        ],
      });

      const meta = await provider.fetchMetadata('apple');
      expect(meta?.enDef).toBe('A common round fruit');
      expect(meta?.pos).toBe('n');
      expect(meta?.phoneticUs).toBe('/ˈæpəl/');
    });
  });
});
