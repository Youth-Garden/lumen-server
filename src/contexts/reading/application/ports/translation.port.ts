export abstract class TranslationPort {
  abstract translate(text: string, from: string, to: string): Promise<string>;
}
