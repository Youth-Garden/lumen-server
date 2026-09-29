export interface ImageProviderConfig {
  name: string;
  enabled: boolean;
  apiKey?: string;
  timeoutMs: number;
}

export interface EnrichmentConfig {
  imageProviders: {
    pixabay: ImageProviderConfig;
    unsplash: ImageProviderConfig;
    pexels: ImageProviderConfig;
    wikimedia: ImageProviderConfig;
    wikipedia: ImageProviderConfig;
  };
  translation: {
    defaultSourceLang: string;
    defaultTargetLang: string;
    timeoutMs: number;
  };
  dictionary: {
    timeoutMs: number;
  };
  cloudinary: {
    folder: string;
  };
}

export const DEFAULT_ENRICHMENT_CONFIG: EnrichmentConfig = {
  imageProviders: {
    pixabay: {
      name: 'Pixabay',
      enabled: true,
      apiKey:
        process.env.PIXABAY_API_KEY || '57757775-157d5dec6a75e09a1e1fde580',
      timeoutMs: 4000,
    },
    unsplash: {
      name: 'Unsplash',
      enabled: Boolean(
        process.env.UNSPLASH_ACCESS_KEY || process.env.UNSPLASH_CLIENT_ID,
      ),
      apiKey:
        process.env.UNSPLASH_ACCESS_KEY || process.env.UNSPLASH_CLIENT_ID || '',
      timeoutMs: 3500,
    },
    pexels: {
      name: 'Pexels',
      enabled: Boolean(process.env.PEXELS_API_KEY),
      apiKey: process.env.PEXELS_API_KEY || '',
      timeoutMs: 3500,
    },
    wikimedia: {
      name: 'Wikimedia Commons',
      enabled: true,
      timeoutMs: 3500,
    },
    wikipedia: {
      name: 'Wikipedia PageImages',
      enabled: true,
      timeoutMs: 3500,
    },
  },
  translation: {
    defaultSourceLang: 'en',
    defaultTargetLang: 'vi',
    timeoutMs: 4000,
  },
  dictionary: {
    timeoutMs: 4000,
  },
  cloudinary: {
    folder: process.env.CLOUDINARY_VOCAB_FOLDER || 'lumen/vocabulary/images',
  },
};
