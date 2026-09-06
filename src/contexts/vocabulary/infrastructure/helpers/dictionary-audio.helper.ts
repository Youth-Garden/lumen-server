import axios from 'axios';

export interface DictionaryAudioResult {
  audioUsUrl: string | null;
  audioUkUrl: string | null;
  phoneticUs: string | null;
  phoneticUk: string | null;
  phoneticDefault: string | null;
}

interface DictionaryPhoneticEntry {
  text?: string;
  audio?: string;
  sourceUrl?: string;
}

interface DictionaryWordResponse {
  word?: string;
  phonetic?: string;
  phonetics?: DictionaryPhoneticEntry[];
}

export async function fetchDictionaryPronunciations(
  term: string,
): Promise<DictionaryAudioResult> {
  const result: DictionaryAudioResult = {
    audioUsUrl: null,
    audioUkUrl: null,
    phoneticUs: null,
    phoneticUk: null,
    phoneticDefault: null,
  };

  const cleanTerm = term.trim().toLowerCase();
  if (!cleanTerm) return result;

  try {
    const response = await axios.get<DictionaryWordResponse[]>(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanTerm)}`,
      {
        timeout: 4000,
        headers: {
          'User-Agent': 'Lumen-Vocab-Service/1.0',
        },
      },
    );

    const firstEntry = response.data?.[0];
    if (!firstEntry) return result;

    result.phoneticDefault = firstEntry.phonetic || null;

    const phoneticsList = firstEntry.phonetics || [];
    for (const entry of phoneticsList) {
      const audioUrl = entry.audio?.trim();
      const phoneticText = entry.text?.trim();

      if (audioUrl) {
        const lowerAudioUrl = audioUrl.toLowerCase();
        if (
          lowerAudioUrl.includes('-us.') ||
          lowerAudioUrl.includes('/us/') ||
          lowerAudioUrl.includes('_us.')
        ) {
          if (!result.audioUsUrl) result.audioUsUrl = audioUrl;
          if (!result.phoneticUs && phoneticText)
            result.phoneticUs = phoneticText;
        } else if (
          lowerAudioUrl.includes('-uk.') ||
          lowerAudioUrl.includes('/uk/') ||
          lowerAudioUrl.includes('_uk.')
        ) {
          if (!result.audioUkUrl) result.audioUkUrl = audioUrl;
          if (!result.phoneticUk && phoneticText)
            result.phoneticUk = phoneticText;
        } else if (!result.audioUsUrl) {
          result.audioUsUrl = audioUrl;
        }
      }

      if (phoneticText) {
        if (!result.phoneticDefault) {
          result.phoneticDefault = phoneticText;
        }
      }
    }

    return result;
  } catch {
    return result;
  }
}
