export class ListGrammarTopicsQuery {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly search?: string,
    public readonly cefrLevel?: string,
    public readonly category?: string,
  ) {}
}
