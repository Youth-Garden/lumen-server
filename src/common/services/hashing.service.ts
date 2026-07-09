import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

/**
 * HashingService is a domain-agnostic utility for password hashing.
 * Belongs in common/ because it has zero dependency on any business domain.
 */
@Injectable()
export class HashingService {
  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
