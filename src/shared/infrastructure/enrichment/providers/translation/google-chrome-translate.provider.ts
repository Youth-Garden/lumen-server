import { BaseHttpClient } from '../../client/enrichment-http.client';
import { DEFAULT_ENRICHMENT_CONFIG } from '../../config/enrichment.config';
import { EnrichmentEndpointEnum } from '../../constants/enrichment-endpoint.enum';
import type { ITranslationProvider } from '../../interfaces/enrichment-providers.interface';

export class GoogleChromeTranslateProvider
  extends BaseHttpClient
  implements ITranslationProvider
{
  readonly name = 'Google Dict Chrome API';

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

    const data = await this.get<string[] | string>(
      EnrichmentEndpointEnum.GOOGLE_CHROME_TRANSLATE,
      {
        params: {
          client: 'dict-chrome-ex',
          sl: sourceLang,
          tl: targetLang,
          q: clean,
        },
        timeoutMs: this.timeoutMs,
      },
    );

    const translated = Array.isArray(data) ? data[0] : data;
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
