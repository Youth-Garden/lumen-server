export class UserBadge {
  private constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _badgeType: string,
    private readonly _earnedAt: Date,
  ) {}

  static create(id: string, userId: string, badgeType: string): UserBadge {
    return new UserBadge(id, userId, badgeType, new Date());
  }

  static reconstitute(
    id: string,
    userId: string,
    badgeType: string,
    earnedAt: Date,
  ): UserBadge {
    return new UserBadge(id, userId, badgeType, earnedAt);
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get badgeType(): string {
    return this._badgeType;
  }

  get earnedAt(): Date {
    return this._earnedAt;
  }
}
