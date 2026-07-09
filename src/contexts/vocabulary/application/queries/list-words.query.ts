export class ListWordsQuery {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly search?: string,
    public readonly sortBy?: string,
    public readonly sortOrder?: 'ASC' | 'DESC',
    public readonly cefrLevel?: string,
    public readonly partOfSpeech?: string,
  ) {}
}
