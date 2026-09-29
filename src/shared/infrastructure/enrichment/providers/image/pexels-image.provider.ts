import { DEFAULT_ENRICHMENT_CONFIG } from '../../config/enrichment.config';
import { EnrichmentEndpointEnum } from '../../constants/enrichment-endpoint.enum';
import { BaseHttpClient } from '../../client/enrichment-http.client';
import type { IImageProvider } from '../../interfaces/enrichment-providers.interface';

interface PexelsPhoto {
  src?: {
    landscape?: string;
    medium?: string;
  };
}

interface PexelsResponse {
  photos?: PexelsPhoto[];
}

export class PexelsImageProvider
  extends BaseHttpClient
  implements IImageProvider
{
  readonly name = 'Pexels';

  constructor(
    private readonly apiKey: string = DEFAULT_ENRICHMENT_CONFIG.imageProviders
      .pexels.apiKey || '',
    private readonly timeoutMs: number = DEFAULT_ENRICHMENT_CONFIG
      .imageProviders.pexels.timeoutMs,
  ) {
    super();
  }

  isEnabled(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async fetchImage(term: string): Promise<string | null> {
    if (!this.isEnabled()) return null;

    const data = await this.get<PexelsResponse>(
      EnrichmentEndpointEnum.PEXELS_IMAGE,
      {
        params: {
          query: term.trim().toLowerCase(),
          orientation: 'landscape',
          per_page: 1,
        },
        headers: { Authorization: this.apiKey },
        timeoutMs: this.timeoutMs,
      },
    );

    const photo = data?.photos?.[0];
    return photo?.src?.landscape || photo?.src?.medium || null;
  }
}
