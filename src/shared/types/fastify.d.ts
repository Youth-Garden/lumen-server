import { Role } from '../../contexts/iam/domain/enums/role.enum';

export interface RequestUser {
  userId: string;
  role: Role | string;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: RequestUser;
    cookies?: Record<string, string | undefined>;
  }
}
