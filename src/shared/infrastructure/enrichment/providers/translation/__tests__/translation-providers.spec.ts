import axios from 'axios';
import { GoogleChromeTranslateProvider } from '../google-chrome-translate.provider';
import { GoogleGtxTranslateProvider } from '../google-gtx-translate.provider';
import { MyMemoryTranslateProvider } from '../mymemory-translate.provider';
import { CompositeTranslationProvider } from '../composite-translation.provider';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Translation Providers Unit Tests', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GoogleChromeTranslateProvider', () => {
    it('translates text via Google Dict Chrome API', async () => {
      const provider = new GoogleChromeTranslateProvider();
      expect(provider.isEnabled()).toBe(true);

      mockedAxios.get.mockResolvedValueOnce({
        data: ['quả táo'],
      });

      const res = await provider.translate('apple', 'vi', 'en');
      expect(res).toBe('quả táo');
    });

    it('returns null on failure', async () => {
      const provider = new GoogleChromeTranslateProvider();
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      const res = await provider.translate('apple', 'vi', 'en');
      expect(res).toBeNull();
    });
  });

  describe('GoogleGtxTranslateProvider', () => {
    it('translates text via GTX API', async () => {
      const provider = new GoogleGtxTranslateProvider();
      expect(provider.isEnabled()).toBe(true);

      mockedAxios.get.mockResolvedValueOnce({
        data: [[['quả táo', 'apple']]],
      });

      const res = await provider.translate('apple', 'vi', 'en');
      expect(res).toBe('quả táo');
    });
  });

  describe('MyMemoryTranslateProvider', () => {
    it('translates text via MyMemory API', async () => {
      const provider = new MyMemoryTranslateProvider();
      expect(provider.isEnabled()).toBe(true);

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          responseData: { translatedText: 'quả táo' },
        },
      });

      const res = await provider.translate('apple', 'vi', 'en');
      expect(res).toBe('quả táo');
    });
  });

  describe('CompositeTranslationProvider', () => {
    it('tries translation providers in chain until success', async () => {
      const p1 = {
        name: 'P1',
        isEnabled: () => true,
        translate: jest.fn().mockResolvedValue(null),
      };
      const p2 = {
        name: 'P2',
        isEnabled: () => true,
        translate: jest.fn().mockResolvedValue('sách'),
      };
      const composite = new CompositeTranslationProvider([p1, p2]);

      const res = await composite.translate('book', 'vi', 'en');
      expect(res).toBe('sách');
      expect(p1.translate).toHaveBeenCalledWith('book', 'vi', 'en');
      expect(p2.translate).toHaveBeenCalledWith('book', 'vi', 'en');
    });
  });
});
