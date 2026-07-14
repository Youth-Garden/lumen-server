export enum UserNoteCategory {
  GRAMMAR = 'GRAMMAR',
  VOCABULARY = 'VOCABULARY',
  STRATEGY = 'STRATEGY',
  REMINDER = 'REMINDER',
}

export class UserNote {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly questionId: string,
    public readonly testId: string,
    public readonly content: string,
    public readonly category: UserNoteCategory,
    public readonly tags: string[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static restore(
    id: string,
    userId: string,
    questionId: string,
    testId: string,
    content: string,
    category: UserNoteCategory,
    tags: string[],
    createdAt: Date,
    updatedAt: Date,
  ): UserNote {
    return new UserNote(
      id,
      userId,
      questionId,
      testId,
      content,
      category,
      tags,
      createdAt,
      updatedAt,
    );
  }
}
