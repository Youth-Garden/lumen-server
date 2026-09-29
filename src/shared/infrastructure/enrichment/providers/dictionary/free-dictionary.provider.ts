import { DEFAULT_ENRICHMENT_CONFIG } from '../../config/enrichment.config';
import { EnrichmentEndpointEnum } from '../../constants/enrichment-endpoint.enum';
import { BaseHttpClient } from '../../client/enrichment-http.client';
import type {
  IDictionaryProvider,
  EnrichedDictionaryMetadata,
} from '../../interfaces/enrichment-providers.interface';

interface FreeDictPhonetic {
  text?: string;
  audio?: string;
}

interface FreeDictMeaning {
  partOfSpeech?: string;
  definitions?: Array<{
    definition?: string;
    example?: string;
  }>;
}

interface FreeDictEntry {
  phonetics?: FreeDictPhonetic[];
  meanings?: FreeDictMeaning[];
}

export class FreeDictionaryProvider
  extends BaseHttpClient
  implements IDictionaryProvider
{
  readonly name = 'FreeDictionary API';

  constructor(
    private readonly timeoutMs: number = DEFAULT_ENRICHMENT_CONFIG.dictionary
      .timeoutMs,
  ) {
    super();
  }

  isEnabled(): boolean {
    return true;
  }

  async fetchMetadata(
    term: string,
  ): Promise<Partial<EnrichedDictionaryMetadata> | null> {
    const cleanTerm = term.trim().toLowerCase();
    const url = this.buildPathUrl(
      EnrichmentEndpointEnum.FREE_DICTIONARY,
      cleanTerm,
    );

    const data = await this.get<FreeDictEntry[]>(url, {
      timeoutMs: this.timeoutMs,
    });

    if (Array.isArray(data) && data.length > 0) {
      const entry = data[0];
      let phoneticUs: string | null = null;
      let phoneticUk: string | null = null;
      let audioUsUrl: string | null = null;
      let audioUkUrl: string | null = null;
      let enDef: string | null = null;
      let pos = 'noun';
      let enExample: string | null = null;

      if (entry.phonetics && Array.isArray(entry.phonetics)) {
        for (const p of entry.phonetics) {
          if (p.audio) {
            if (
              p.audio.includes('-us') ||
              p.audio.includes('/us/') ||
              p.audio.includes('en-us')
            ) {
              audioUsUrl = audioUsUrl || p.audio;
            } else if (
              p.audio.includes('-uk') ||
              p.audio.includes('/uk/') ||
              p.audio.includes('en-uk') ||
              p.audio.includes('en-gb')
            ) {
              audioUkUrl = audioUkUrl || p.audio;
            } else {
              audioUsUrl = audioUsUrl || p.audio;
            }
          }
          if (p.text) {
            if (p.audio?.includes('-us') || p.audio?.includes('/us/')) {
              phoneticUs = phoneticUs || p.text;
            } else if (p.audio?.includes('-uk') || p.audio?.includes('/uk/')) {
              phoneticUk = phoneticUk || p.text;
            } else {
              phoneticUs = phoneticUs || p.text;
            }
          }
        }
      }

      if (
        entry.meanings &&
        Array.isArray(entry.meanings) &&
        entry.meanings.length > 0
      ) {
        const meaning = entry.meanings[0];
        pos = meaning.partOfSpeech || 'noun';
        if (meaning.definitions && meaning.definitions.length > 0) {
          enDef = meaning.definitions[0].definition || null;
          enExample = meaning.definitions[0].example || null;
        }
      }

      return {
        phoneticUs,
        phoneticUk,
        audioUsUrl,
        audioUkUrl,
        enDef,
        pos,
        enExample,
      };
    }

    return null;
  }
}
