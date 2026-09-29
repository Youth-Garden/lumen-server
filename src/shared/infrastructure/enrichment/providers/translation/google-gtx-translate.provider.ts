import { DEFAULT_ENRICHMENT_CONFIG } from '../../config/enrichment.config';
import { EnrichmentEndpointEnum } from '../../constants/enrichment-endpoint.enum';
import { BaseHttpClient } from '../../client/enrichment-http.client';
import type { ITranslationProvider } from '../../interfaces/enrichment-providers.interface';

type GtxSentence = [string, string];
type GtxResponse = [GtxSentence[]];

export class GoogleGtxTranslateProvider
  extends BaseHttpClient
  implements ITranslationProvider
{
  readonly name = 'Google GTX API';

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

    const data = await this.get<GtxResponse>(
      EnrichmentEndpointEnum.GOOGLE_GTX_TRANSLATE,
      {
        params: {
          client: 'gtx',
          sl: sourceLang,
          tl: targetLang,
          dt: 't',
          q: clean,
        },
        timeoutMs: this.timeoutMs,
      },
    );

    if (data?.[0]) {
      const translated = data[0]
        .map((item) => item?.[0] || '')
        .join('')
        .trim();
      if (translated && translated.toLowerCase() !== clean.toLowerCase()) {
        return translated;
      }
    }

    return null;
  }
}
