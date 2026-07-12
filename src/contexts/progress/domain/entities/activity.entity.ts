export class Activity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly type: string,
    public readonly title: string,
    public readonly description: string,
    public readonly xpEarned: number,
    public readonly durationMinutes: number,
    public readonly timestamp: Date,
  ) {}

  static create(
    id: string,
    userId: string,
    type: string,
    title: string,
    description: string,
    xpEarned: number,
    durationMinutes: number = 0,
  ): Activity {
    return new Activity(
      id,
      userId,
      type,
      title,
      description,
      xpEarned,
      durationMinutes,
      new Date(),
    );
  }

  static restore(
    id: string,
    userId: string,
    type: string,
    title: string,
    description: string,
    xpEarned: number,
    durationMinutes: number,
    timestamp: Date,
  ): Activity {
    return new Activity(
      id,
      userId,
      type,
      title,
      description,
      xpEarned,
      durationMinutes,
      timestamp,
    );
  }
}
