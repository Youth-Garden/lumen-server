export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly role: string,
    public readonly planId: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
