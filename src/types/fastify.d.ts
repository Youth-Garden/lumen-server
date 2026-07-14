import 'fastify';
import type { CookieSerializeOptions } from '@fastify/cookie';

import { Role } from '../contexts/iam/domain/enums/role.enum';

declare module 'fastify' {
  interface FastifyRequest {
    cookies: { [cookieName: string]: string | undefined };
    user?: {
      userId: string;
      role: Role;
    };
  }

  interface FastifyReply {
    cookie(name: string, value: string, options?: CookieSerializeOptions): this;
    clearCookie(name: string, options?: CookieSerializeOptions): this;
  }
}
