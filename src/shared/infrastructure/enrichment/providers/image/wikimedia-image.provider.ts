import { DEFAULT_ENRICHMENT_CONFIG } from '../../config/enrichment.config';
import { EnrichmentEndpointEnum } from '../../constants/enrichment-endpoint.enum';
import { BaseHttpClient } from '../../client/enrichment-http.client';
import type { IImageProvider } from '../../interfaces/enrichment-providers.interface';

interface WikimediaSearchResult {
  title: string;
}

interface WikimediaSearchResponse {
  query?: {
    search?: WikimediaSearchResult[];
  };
}

interface WikimediaImageInfo {
  thumburl?: string;
  url?: string;
}

interface WikimediaInfoResponse {
  query?: {
    pages?: Record<
      string,
      {
        imageinfo?: WikimediaImageInfo[];
      }
    >;
  };
}

export class WikimediaImageProvider
  extends BaseHttpClient
  implements IImageProvider
{
  readonly name = 'Wikimedia Commons';

  constructor(
    private readonly timeoutMs: number = DEFAULT_ENRICHMENT_CONFIG
      .imageProviders.wikimedia.timeoutMs,
  ) {
    super();
  }

  isEnabled(): boolean {
    return true;
  }

  async fetchImage(term: string): Promise<string | null> {
    const cleanTerm = term.trim().toLowerCase();

    const searchData = await this.get<WikimediaSearchResponse>(
      EnrichmentEndpointEnum.WIKIMEDIA_COMMONS,
      {
        params: {
          action: 'query',
          list: 'search',
          srsearch: `${cleanTerm} photo`,
          srnamespace: 6,
          format: 'json',
        },
        timeoutMs: this.timeoutMs,
      },
    );

    const searchResults = searchData?.query?.search || [];
    const validFile = searchResults.find((item) =>
      /\.(jpg|jpeg|png|webp)$/i.test(item.title),
    );

    if (validFile) {
      const infoData = await this.get<WikimediaInfoResponse>(
        EnrichmentEndpointEnum.WIKIMEDIA_COMMONS,
        {
          params: {
            action: 'query',
            titles: validFile.title,
            prop: 'imageinfo',
            iiprop: 'url',
            iiurlwidth: 600,
            format: 'json',
          },
          timeoutMs: this.timeoutMs,
        },
      );

      const pages = infoData?.query?.pages;
      const pageKeys = Object.keys(pages || {});
      if (pageKeys.length > 0) {
        const pageId = pageKeys[0];
        const pageInfo = pages?.[pageId];
        const imgUrl =
          pageInfo?.imageinfo?.[0]?.thumburl || pageInfo?.imageinfo?.[0]?.url;
        if (imgUrl) return imgUrl;
      }
    }

    return null;
  }
}
