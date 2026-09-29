import { DEFAULT_ENRICHMENT_CONFIG } from '../../config/enrichment.config';
import { EnrichmentEndpointEnum } from '../../constants/enrichment-endpoint.enum';
import { BaseHttpClient } from '../../client/enrichment-http.client';
import type { IImageProvider } from '../../interfaces/enrichment-providers.interface';

interface UnsplashPhoto {
  urls?: {
    raw?: string;
  };
}

interface UnsplashResponse {
  results?: UnsplashPhoto[];
}

export class UnsplashImageProvider
  extends BaseHttpClient
  implements IImageProvider
{
  readonly name = 'Unsplash';

  constructor(
    private readonly apiKey: string = DEFAULT_ENRICHMENT_CONFIG.imageProviders
      .unsplash.apiKey || '',
    private readonly timeoutMs: number = DEFAULT_ENRICHMENT_CONFIG
      .imageProviders.unsplash.timeoutMs,
  ) {
    super();
  }

  isEnabled(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async fetchImage(term: string): Promise<string | null> {
    if (!this.isEnabled()) return null;

    const data = await this.get<UnsplashResponse>(
      EnrichmentEndpointEnum.UNSPLASH_IMAGE,
      {
        params: {
          query: term.trim().toLowerCase(),
          orientation: 'landscape',
          per_page: 1,
          client_id: this.apiKey,
        },
        timeoutMs: this.timeoutMs,
      },
    );

    const rawUrl = data?.results?.[0]?.urls?.raw;
    if (rawUrl) {
      const separator = rawUrl.includes('?') ? '&' : '?';
      return `${rawUrl}${separator}auto=format&fit=crop&w=600&fm=webp&q=80`;
    }

    return null;
  }
}
