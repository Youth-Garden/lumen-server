import type { IImageProvider } from '../../interfaces/enrichment-providers.interface';
import { PixabayImageProvider } from './pixabay-image.provider';
import { UnsplashImageProvider } from './unsplash-image.provider';
import { PexelsImageProvider } from './pexels-image.provider';
import { WikimediaImageProvider } from './wikimedia-image.provider';
import { WikipediaImageProvider } from './wikipedia-image.provider';

export class CompositeImageProvider implements IImageProvider {
  readonly name = 'Composite Image Provider Chain';
  private readonly providers: IImageProvider[];

  constructor(customProviders?: IImageProvider[]) {
    this.providers = customProviders || [
      new PixabayImageProvider(),
      new UnsplashImageProvider(),
      new PexelsImageProvider(),
      new WikimediaImageProvider(),
      new WikipediaImageProvider(),
    ];
  }

  isEnabled(): boolean {
    return this.providers.some((p) => p.isEnabled());
  }

  async fetchImage(term: string): Promise<string | null> {
    for (const provider of this.providers) {
      if (!provider.isEnabled()) continue;

      try {
        const imageUrl = await provider.fetchImage(term);
        if (imageUrl) {
          return imageUrl;
        }
      } catch {
        // Fall through on error
      }
    }

    return null;
  }
}
