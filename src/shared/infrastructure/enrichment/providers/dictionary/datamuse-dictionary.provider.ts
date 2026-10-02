import { DEFAULT_ENRICHMENT_CONFIG } from '../../config/enrichment.config';
import { EnrichmentEndpointEnum } from '../../constants/enrichment-endpoint.enum';
import { BaseHttpClient } from '../../client/enrichment-http.client';
import type {
  IDictionaryProvider,
  EnrichedDictionaryMetadata,
} from '../../interfaces/enrichment-providers.interface';

const ARPABET_MAP: Record<string, string> = {
  AA: 'ɑː',
  AE: 'æ',
  AH: 'ə',
  AO: 'ɔː',
  AW: 'aʊ',
  AY: 'aɪ',
  B: 'b',
  CH: 'tʃ',
  D: 'd',
  DH: 'ð',
  EH: 'ɛ',
  ER: 'ər',
  EY: 'eɪ',
  F: 'f',
  G: 'ɡ',
  HH: 'h',
  IH: 'ɪ',
  IY: 'iː',
  JH: 'dʒ',
  K: 'k',
  L: 'l',
  M: 'm',
  N: 'n',
  NG: 'ŋ',
  OW: 'oʊ',
  OY: 'ɔɪ',
  P: 'p',
  R: 'r',
  S: 's',
  SH: 'ʃ',
  T: 't',
  TH: 'θ',
  UH: 'ʊ',
  UW: 'uː',
  V: 'v',
  W: 'w',
  Y: 'j',
  Z: 'z',
  ZH: 'ʒ',
};

function arpabetToIpa(arpabetString: string): string {
  const tokens = arpabetString.trim().split(/\s+/);
  let ipa = '';

  for (const token of tokens) {
    const phone = token.replace(/[012]/g, '');
    const stress = token.match(/[012]/)?.[0];
    const ipaSymbol = ARPABET_MAP[phone] || phone.toLowerCase();

    if (stress === '1') {
      ipa += 'ˈ' + ipaSymbol;
    } else if (stress === '2') {
      ipa += 'ˌ' + ipaSymbol;
    } else {
      ipa += ipaSymbol;
    }
  }

  return `/${ipa}/`;
}

interface DatamuseResult {
  word: string;
  defs?: string[];
  tags?: string[];
}

export interface DatamuseRelationGroup {
  synonyms: string[];
  antonyms: string[];
  relatedWords: string[];
}

const STOPWORDS = new Set([
  'a',
  'an',
  'the',
  'and',
  'or',
  'but',
  'in',
  'on',
  'at',
  'to',
  'for',
  'of',
  'with',
  'by',
  'from',
  'up',
  'about',
  'into',
  'over',
  'after',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'it',
  'its',
]);

export class DatamuseDictionaryProvider
  extends BaseHttpClient
  implements IDictionaryProvider
{
  readonly name = 'Datamuse API';

  constructor(
    private readonly timeoutMs: number = DEFAULT_ENRICHMENT_CONFIG.dictionary
      .timeoutMs,
  ) {
    super();
  }

  isEnabled(): boolean {
    return true;
  }

  async fetchRelations(term: string): Promise<DatamuseRelationGroup> {
    const cleanTerm = term.trim().toLowerCase();
    const result: DatamuseRelationGroup = {
      synonyms: [],
      antonyms: [],
      relatedWords: [],
    };

    const apiKey = process.env.DATAMUSE_API_KEY;
    const baseParams: Record<string, string | number> = { max: 20 };
    if (apiKey) {
      baseParams.key = apiKey;
    }

    try {
      // 1. Fetch Fallback Synonyms & Antonyms
      const [synData, antData] = await Promise.all([
        this.get<DatamuseResult[]>(EnrichmentEndpointEnum.DATAMUSE_DICTIONARY, {
          params: { ...baseParams, rel_syn: cleanTerm },
          timeoutMs: this.timeoutMs,
        }).catch(() => []),
        this.get<DatamuseResult[]>(EnrichmentEndpointEnum.DATAMUSE_DICTIONARY, {
          params: { ...baseParams, rel_ant: cleanTerm },
          timeoutMs: this.timeoutMs,
        }).catch(() => []),
      ]);

      const filterTerms = (rawList: DatamuseResult[] | null): string[] => {
        const seen = new Set<string>();
        const res: string[] = [];
        for (const item of rawList || []) {
          const t = item.word?.trim().toLowerCase();
          if (
            t &&
            t !== cleanTerm &&
            /^[a-z\s-]+$/i.test(t) &&
            !STOPWORDS.has(t) &&
            !seen.has(t)
          ) {
            seen.add(t);
            res.push(t);
            if (res.length >= 8) break;
          }
        }
        return res;
      };

      result.synonyms = filterTerms(synData);
      result.antonyms = filterTerms(antData);

      // 2. Fetch Collocations (rel_jjb, rel_jja, rel_bga, rel_bgb)
      const [jjbData, jjaData, bgaData, bgbData] = await Promise.all([
        this.get<DatamuseResult[]>(EnrichmentEndpointEnum.DATAMUSE_DICTIONARY, {
          params: { ...baseParams, rel_jjb: cleanTerm },
          timeoutMs: this.timeoutMs,
        }).catch(() => []),
        this.get<DatamuseResult[]>(EnrichmentEndpointEnum.DATAMUSE_DICTIONARY, {
          params: { ...baseParams, rel_jja: cleanTerm },
          timeoutMs: this.timeoutMs,
        }).catch(() => []),
        this.get<DatamuseResult[]>(EnrichmentEndpointEnum.DATAMUSE_DICTIONARY, {
          params: { ...baseParams, rel_bga: cleanTerm },
          timeoutMs: this.timeoutMs,
        }).catch(() => []),
        this.get<DatamuseResult[]>(EnrichmentEndpointEnum.DATAMUSE_DICTIONARY, {
          params: { ...baseParams, rel_bgb: cleanTerm },
          timeoutMs: this.timeoutMs,
        }).catch(() => []),
      ]);

      const seenCollocations = new Set<string>();
      const collocations: string[] = [];

      const processCollocation = (
        format: (w: string) => string,
        items: DatamuseResult[] | null,
      ) => {
        for (const item of items || []) {
          const w = item.word?.trim().toLowerCase();
          if (
            !w ||
            w === cleanTerm ||
            STOPWORDS.has(w) ||
            !/^[a-z\s-]+$/i.test(w)
          )
            continue;
          const phrase = format(w).trim().toLowerCase();
          if (phrase && !seenCollocations.has(phrase)) {
            seenCollocations.add(phrase);
            collocations.push(phrase);
            if (collocations.length >= 8) break;
          }
        }
      };

      processCollocation((w) => `${w} ${cleanTerm}`, jjbData);
      processCollocation((w) => `${cleanTerm} ${w}`, jjaData);
      processCollocation((w) => `${cleanTerm} ${w}`, bgaData);
      processCollocation((w) => `${w} ${cleanTerm}`, bgbData);

      result.relatedWords = collocations.slice(0, 8);
    } catch {
      // Ignore enrichment network failures
    }

    return result;
  }

  async fetchMetadata(
    term: string,
  ): Promise<Partial<EnrichedDictionaryMetadata> | null> {
    const cleanTerm = term.trim().toLowerCase();

    const data = await this.get<DatamuseResult[]>(
      EnrichmentEndpointEnum.DATAMUSE_DICTIONARY,
      {
        params: {
          sp: cleanTerm,
          md: 'd,r',
          max: 1,
        },
        timeoutMs: this.timeoutMs,
      },
    );

    const dmItem = data?.[0];

    if (dmItem) {
      let enDef: string | null = null;
      let pos = 'noun';
      let phoneticUs: string | null = null;

      if (dmItem.defs?.length) {
        const parts = dmItem.defs[0].split('\t');
        if (parts.length >= 2) {
          pos = parts[0];
          enDef = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
        } else {
          enDef =
            dmItem.defs[0].charAt(0).toUpperCase() + dmItem.defs[0].slice(1);
        }
      }

      const pronTag = dmItem.tags?.find((t) => t.startsWith('pron:'));
      if (pronTag) {
        const rawArpabet = pronTag.replace('pron:', '').trim();
        phoneticUs = arpabetToIpa(rawArpabet);
      }

      return {
        enDef,
        pos,
        phoneticUs,
        phoneticUk: phoneticUs,
      };
    }

    return null;
  }
}
