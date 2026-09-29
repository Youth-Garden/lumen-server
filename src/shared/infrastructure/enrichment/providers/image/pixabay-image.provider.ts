import { DEFAULT_ENRICHMENT_CONFIG } from '../../config/enrichment.config';
import { EnrichmentEndpointEnum } from '../../constants/enrichment-endpoint.enum';
import { BaseHttpClient } from '../../client/enrichment-http.client';
import type { IImageProvider } from '../../interfaces/enrichment-providers.interface';

interface PixabayHit {
  webformatURL?: string;
}

interface PixabayResponse {
  hits?: PixabayHit[];
}

export class PixabayImageProvider
  extends BaseHttpClient
  implements IImageProvider
{
  readonly name = 'Pixabay';

  constructor(
    private readonly apiKey: string = DEFAULT_ENRICHMENT_CONFIG.imageProviders
      .pixabay.apiKey || '',
    private readonly timeoutMs: number = DEFAULT_ENRICHMENT_CONFIG
      .imageProviders.pixabay.timeoutMs,
  ) {
    super();
  }

  isEnabled(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async fetchImage(term: string): Promise<string | null> {
    if (!this.isEnabled()) return null;

    const data = await this.get<PixabayResponse>(
      EnrichmentEndpointEnum.PIXABAY_IMAGE,
      {
        params: {
          key: this.apiKey,
          q: term.trim().toLowerCase(),
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: 'true',
          per_page: 3,
        },
        timeoutMs: this.timeoutMs,
      },
    );

    return data?.hits?.[0]?.webformatURL ?? null;
  }
}
