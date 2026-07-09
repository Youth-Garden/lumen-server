import { Injectable } from '@nestjs/common';
import { TranslationPort } from '../../application/ports/translation.port';
import axios from 'axios';

@Injectable()
export class MyMemoryTranslationAdapter implements TranslationPort {
  async translate(text: string, from: string, to: string): Promise<string> {
    try {
      const res = await axios.get<{ responseData: { translatedText: string } }>(
        `https://api.mymemory.translated.net/get`,
        {
          params: {
            q: text,
            langpair: `${from}|${to}`,
          },
        },
      );
      return res.data?.responseData?.translatedText || 'N/A';
    } catch {
      return 'Translation error';
    }
  }
}
