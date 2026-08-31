import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { AuthEx } from '../../../contexts/iam/domain/exceptions/auth.exception';
import { AppException } from '../../domain/exceptions/app.exception';

export interface RefreshTokenOptions {
  required?: boolean;
}

export const RefreshToken = createParamDecorator(
  (options: RefreshTokenOptions | undefined, ctx: ExecutionContext): string | null => {
    const isRequired = options?.required ?? true;
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    const refreshTokenHeader = request.headers['x-refresh-token'];
    const headerToken = Array.isArray(refreshTokenHeader)
      ? refreshTokenHeader[0]
      : refreshTokenHeader;
    const bodyToken = (request.body as any)?.refreshToken;

    const token = bodyToken || headerToken || request.cookies?.jwtr || '';

    if (!token && isRequired) {
      throw new AppException(AuthEx.MissingRefreshToken);
    }
    return token || null;
  },
);
