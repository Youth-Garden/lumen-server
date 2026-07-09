import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TranslateTextQuery } from '../queries/translate-text.query';
import { TranslationPort } from '../ports/translation.port';
import { Inject } from '@nestjs/common';

export const TRANSLATION_PORT = Symbol('TRANSLATION_PORT');

@QueryHandler(TranslateTextQuery)
export class TranslateTextHandler implements IQueryHandler<
  TranslateTextQuery,
  string
> {
  constructor(
    @Inject(TRANSLATION_PORT)
    private readonly translationPort: TranslationPort,
  ) {}

  async execute(query: TranslateTextQuery): Promise<string> {
    if (!query.text) return '';
    return this.translationPort.translate(query.text, query.from, query.to);
  }
}
