import { DEFAULT_ENRICHMENT_CONFIG } from '../../config/enrichment.config';
import { EnrichmentEndpointEnum } from '../../constants/enrichment-endpoint.enum';
import { BaseHttpClient } from '../../client/enrichment-http.client';
import type { IImageProvider } from '../../interfaces/enrichment-providers.interface';

interface WikipediaPageInfo {
  thumbnail?: {
    source?: string;
  };
}

interface WikipediaResponse {
  query?: {
    pages?: Record<string, WikipediaPageInfo>;
  };
}

export class WikipediaImageProvider
  extends BaseHttpClient
  implements IImageProvider
{
  readonly name = 'Wikipedia PageImages';

  constructor(
    private readonly timeoutMs: number = DEFAULT_ENRICHMENT_CONFIG
      .imageProviders.wikipedia.timeoutMs,
  ) {
    super();
  }

  isEnabled(): boolean {
    return true;
  }

  async fetchImage(term: string): Promise<string | null> {
    const cleanTerm = term.trim().toLowerCase();

    const data = await this.get<WikipediaResponse>(
      EnrichmentEndpointEnum.WIKIPEDIA_API,
      {
        params: {
          action: 'query',
          titles: cleanTerm,
          prop: 'pageimages',
          pithumbsize: 600,
          format: 'json',
        },
        timeoutMs: this.timeoutMs,
      },
    );

    const pages = data?.query?.pages;
    const pageKeys = Object.keys(pages || {});

    if (pageKeys.length > 0) {
      const pageId = pageKeys[0];
      const page = pages?.[pageId];
      if (page?.thumbnail?.source) {
        return page.thumbnail.source;
      }
    }

    return null;
  }
}
