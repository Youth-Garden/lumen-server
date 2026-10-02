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

    it('fetches sense-level synonyms and antonyms', async () => {
      const provider = new FreeDictionaryProvider();

      mockedAxios.get.mockResolvedValueOnce({
        data: [
          {
            meanings: [
              {
                partOfSpeech: 'adjective',
                synonyms: ['inexpensive'],
                definitions: [
                  {
                    definition: 'Low in price.',
                    synonyms: ['cheap', 'affordable'],
                    antonyms: ['expensive'],
                  },
                ],
              },
            ],
          },
        ],
      });

      const relations = await provider.fetchSenseRelations('budget');
      expect(relations).toHaveLength(1);
      expect(relations[0].partOfSpeech).toBe('adjective');
      expect(relations[0].synonyms).toContain('cheap');
      expect(relations[0].synonyms).toContain('affordable');
      expect(relations[0].synonyms).toContain('inexpensive');
      expect(relations[0].antonyms).toEqual(['expensive']);
    });

    it('returns empty array on error for fetchSenseRelations', async () => {
      const provider = new FreeDictionaryProvider();
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      const relations = await provider.fetchSenseRelations('unknownword');
      expect(relations).toEqual([]);
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

    it('fetches collocations and fallback synonyms/antonyms correctly', async () => {
      const provider = new DatamuseDictionaryProvider();

      // Mock 6 parallel requests: rel_syn, rel_ant, rel_jjb, rel_jja, rel_bga, rel_bgb
      mockedAxios.get
        .mockResolvedValueOnce({
          data: [{ word: 'inexpensive' }, { word: 'cheap' }],
        }) // rel_syn
        .mockResolvedValueOnce({ data: [{ word: 'expensive' }] }) // rel_ant
        .mockResolvedValueOnce({ data: [{ word: 'low' }] }) // rel_jjb -> "low budget"
        .mockResolvedValueOnce({ data: [{ word: 'airline' }] }) // rel_jja -> "budget airline"
        .mockResolvedValueOnce({
          data: [{ word: 'deficit' }, { word: 'surplus' }],
        }) // rel_bga -> "budget deficit", "budget surplus"
        .mockResolvedValueOnce({ data: [{ word: 'operation' }] }); // rel_bgb -> "operation budget"

      const rels = await provider.fetchRelations('budget');

      expect(rels.synonyms).toEqual(['inexpensive', 'cheap']);
      expect(rels.antonyms).toEqual(['expensive']);
      expect(rels.relatedWords).toContain('low budget');
      expect(rels.relatedWords).toContain('budget airline');
      expect(rels.relatedWords).toContain('budget deficit');
      expect(rels.relatedWords).toContain('budget surplus');
      expect(rels.relatedWords).toContain('operation budget');
    });
  });
});
