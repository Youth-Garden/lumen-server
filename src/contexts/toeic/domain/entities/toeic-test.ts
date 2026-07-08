export class ToeicTest {
  private constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly isPublished: boolean,
    public readonly createdAt: Date,
  ) {}

  static restore(
    id: string,
    title: string,
    description: string,
    isPublished: boolean,
    createdAt: Date,
  ): ToeicTest {
    return new ToeicTest(id, title, description, isPublished, createdAt);
  }
}
