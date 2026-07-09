export class ListListeningLessonsQuery {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly search?: string,
    public readonly cefrLevel?: string,
  ) {}
}
