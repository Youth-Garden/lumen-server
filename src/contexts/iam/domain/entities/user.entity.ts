import { AuthProvider } from '../enums/auth-provider.enum';
import { Role } from '../enums/role.enum';
import { AggregateRoot } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';

export class User extends AggregateRoot {
  private constructor(
    private readonly _id: string,
    private readonly _email: string,
    private _password: string | null,
    private readonly _authProvider: AuthProvider,
    private readonly _providerId: string | null,
    private readonly _role: Role,
    private readonly _planId: string | null,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
    private _fullName: string | null = null,
    private _avatarUrl: string | null = null,
    private _phone: string | null = null,
  ) {
    super();
  }

  static create(
    email: string,
    password: string | null,
    authProvider: AuthProvider = AuthProvider.LOCAL,
    providerId: string | null = null,
    role: Role = Role.USER,
    planId: string | null = null,
  ): User {
    const user = new User(
      randomUUID(),
      email,
      password,
      authProvider,
      providerId,
      role,
      planId,
      new Date(),
      new Date(),
    );
    // user.apply(new UserRegisteredEvent(user.id, email)); // Optional, if events are needed
    return user;
  }

  static restore(
    id: string,
    email: string,
    password: string | null,
    authProvider: AuthProvider,
    providerId: string | null,
    role: Role,
    planId: string | null,
    createdAt: Date,
    updatedAt: Date,
    fullName: string | null,
    avatarUrl: string | null,
    phone: string | null,
  ): User {
    return new User(
      id,
      email,
      password,
      authProvider,
      providerId,
      role,
      planId,
      createdAt,
      updatedAt,
      fullName,
      avatarUrl,
      phone,
    );
  }

  get id(): string {
    return this._id;
  }
  get email(): string {
    return this._email;
  }
  get password(): string | null {
    return this._password;
  }
  get authProvider(): AuthProvider {
    return this._authProvider;
  }
  get providerId(): string | null {
    return this._providerId;
  }
  get role(): Role {
    return this._role;
  }
  get planId(): string | null {
    return this._planId;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }
  get fullName(): string | null {
    return this._fullName;
  }
  get avatarUrl(): string | null {
    return this._avatarUrl;
  }
  get phone(): string | null {
    return this._phone;
  }

  updateProfile(fullName?: string, avatarUrl?: string, phone?: string): void {
    if (fullName !== undefined) this._fullName = fullName;
    if (avatarUrl !== undefined) this._avatarUrl = avatarUrl;
    if (phone !== undefined) this._phone = phone;
  }

  changePassword(hashedPassword: string): void {
    this._password = hashedPassword;
  }
}
