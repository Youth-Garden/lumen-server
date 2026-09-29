import axios from 'axios';
import { PixabayImageProvider } from '../pixabay-image.provider';
import { UnsplashImageProvider } from '../unsplash-image.provider';
import { PexelsImageProvider } from '../pexels-image.provider';
import { WikimediaImageProvider } from '../wikimedia-image.provider';
import { WikipediaImageProvider } from '../wikipedia-image.provider';
import { CompositeImageProvider } from '../composite-image.provider';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Image Providers Unit Tests', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('PixabayImageProvider', () => {
    it('returns webformatURL when Pixabay hits matches', async () => {
      const provider = new PixabayImageProvider('test_key');
      expect(provider.isEnabled()).toBe(true);

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          hits: [{ webformatURL: 'https://pixabay.com/test.jpg' }],
        },
      });

      const url = await provider.fetchImage('apple');
      expect(url).toBe('https://pixabay.com/test.jpg');
    });

    it('returns null when Pixabay hits are empty', async () => {
      const provider = new PixabayImageProvider('test_key');
      mockedAxios.get.mockResolvedValueOnce({ data: { hits: [] } });

      const url = await provider.fetchImage('unknownword');
      expect(url).toBeNull();
    });
  });

  describe('UnsplashImageProvider', () => {
    it('returns formatted raw photo url when enabled and hits matches', async () => {
      const provider = new UnsplashImageProvider('test_key');
      expect(provider.isEnabled()).toBe(true);

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          results: [{ urls: { raw: 'https://unsplash.com/raw.jpg' } }],
        },
      });

      const url = await provider.fetchImage('book');
      expect(url).toBe(
        'https://unsplash.com/raw.jpg?auto=format&fit=crop&w=600&fm=webp&q=80',
      );
    });

    it('returns null when API key is empty', async () => {
      const provider = new UnsplashImageProvider('');
      expect(provider.isEnabled()).toBe(false);
      const url = await provider.fetchImage('book');
      expect(url).toBeNull();
    });
  });

  describe('PexelsImageProvider', () => {
    it('returns landscape photo url when hits matches', async () => {
      const provider = new PexelsImageProvider('test_key');
      expect(provider.isEnabled()).toBe(true);

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          photos: [{ src: { landscape: 'https://pexels.com/landscape.jpg' } }],
        },
      });

      const url = await provider.fetchImage('cat');
      expect(url).toBe('https://pexels.com/landscape.jpg');
    });
  });

  describe('WikimediaImageProvider', () => {
    it('returns image url from wikimedia pages', async () => {
      const provider = new WikimediaImageProvider();
      expect(provider.isEnabled()).toBe(true);

      // Search query mock response
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          query: {
            search: [{ title: 'File:Apple.jpg' }],
          },
        },
      });

      // Image info query mock response
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          query: {
            pages: {
              '123': {
                imageinfo: [{ url: 'https://upload.wikimedia.org/test.jpg' }],
              },
            },
          },
        },
      });

      const url = await provider.fetchImage('apple');
      expect(url).toBe('https://upload.wikimedia.org/test.jpg');
    });
  });

  describe('WikipediaImageProvider', () => {
    it('returns thumbnail source from wikipedia pageimages', async () => {
      const provider = new WikipediaImageProvider();
      expect(provider.isEnabled()).toBe(true);

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          query: {
            pages: {
              '456': {
                thumbnail: { source: 'https://upload.wikimedia.org/wiki.jpg' },
              },
            },
          },
        },
      });

      const url = await provider.fetchImage('banana');
      expect(url).toBe('https://upload.wikimedia.org/wiki.jpg');
    });
  });

  describe('CompositeImageProvider', () => {
    it('falls back down provider chain until non-null image is found', async () => {
      const p1 = {
        name: 'P1',
        isEnabled: () => true,
        fetchImage: jest.fn().mockResolvedValue(null),
      };
      const p2 = {
        name: 'P2',
        isEnabled: () => true,
        fetchImage: jest.fn().mockResolvedValue('https://fallback.com/img.jpg'),
      };
      const composite = new CompositeImageProvider([p1, p2]);

      const url = await composite.fetchImage('test');
      expect(url).toBe('https://fallback.com/img.jpg');
      expect(p1.fetchImage).toHaveBeenCalledWith('test');
      expect(p2.fetchImage).toHaveBeenCalledWith('test');
    });
  });
});
