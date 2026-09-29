import { DEFAULT_ENRICHMENT_CONFIG } from '../../config/enrichment.config';
import { EnrichmentEndpointEnum } from '../../constants/enrichment-endpoint.enum';
import { BaseHttpClient } from '../../client/enrichment-http.client';
import type { ITranslationProvider } from '../../interfaces/enrichment-providers.interface';

interface MyMemoryResponse {
  responseData?: {
    translatedText?: string;
  };
}

export class MyMemoryTranslateProvider
  extends BaseHttpClient
  implements ITranslationProvider
{
  readonly name = 'MyMemory Translation API';

  constructor(
    private readonly timeoutMs: number = DEFAULT_ENRICHMENT_CONFIG.translation
      .timeoutMs,
  ) {
    super();
  }

  isEnabled(): boolean {
    return true;
  }

  async translate(
    text: string,
    targetLang = 'vi',
    sourceLang = 'en',
  ): Promise<string | null> {
    if (!text || text.trim().length === 0) return null;
    const clean = text.trim();

    const data = await this.get<MyMemoryResponse>(
      EnrichmentEndpointEnum.MYMEMORY_TRANSLATE,
      {
        params: {
          q: clean,
          langpair: `${sourceLang}|${targetLang}`,
        },
        timeoutMs: this.timeoutMs,
      },
    );

    const translated = data?.responseData?.translatedText;
    if (
      translated &&
      typeof translated === 'string' &&
      translated.trim().toLowerCase() !== clean.toLowerCase()
    ) {
      return translated.trim();
    }

    return null;
  }
}
