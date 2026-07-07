export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password: string | null,
    public readonly authProvider: string,
    public readonly providerId: string | null,
    public readonly role: string,
    public readonly planId: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
