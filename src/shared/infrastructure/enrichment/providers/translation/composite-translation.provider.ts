import type { ITranslationProvider } from '../../interfaces/enrichment-providers.interface';
import { GoogleChromeTranslateProvider } from './google-chrome-translate.provider';
import { GoogleGtxTranslateProvider } from './google-gtx-translate.provider';
import { MyMemoryTranslateProvider } from './mymemory-translate.provider';

export class CompositeTranslationProvider implements ITranslationProvider {
  readonly name = 'Composite Translation Chain';
  private readonly providers: ITranslationProvider[];

  constructor(customProviders?: ITranslationProvider[]) {
    this.providers = customProviders || [
      new GoogleChromeTranslateProvider(),
      new GoogleGtxTranslateProvider(),
      new MyMemoryTranslateProvider(),
    ];
  }

  isEnabled(): boolean {
    return this.providers.some((p) => p.isEnabled());
  }

  async translate(
    text: string,
    targetLang = 'vi',
    sourceLang = 'en',
  ): Promise<string | null> {
    if (!text || text.trim().length === 0) return null;
    const clean = text.trim();

    for (const provider of this.providers) {
      if (!provider.isEnabled()) continue;

      try {
        const result = await provider.translate(clean, targetLang, sourceLang);
        if (result && result.trim().toLowerCase() !== clean.toLowerCase()) {
          return result.trim();
        }
      } catch {
        // Fall through on error
      }
    }

    return null;
  }
}
