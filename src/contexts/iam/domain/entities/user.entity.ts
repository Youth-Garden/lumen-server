import { AuthProvider } from '../enums/auth-provider.enum';
import { Role } from '../enums/role.enum';

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password: string | null,
    public readonly authProvider: AuthProvider,
    public readonly providerId: string | null,
    public readonly role: Role,
    public readonly planId: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
