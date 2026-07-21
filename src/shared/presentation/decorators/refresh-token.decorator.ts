import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { AuthEx } from '../../../contexts/iam/domain/exceptions/auth.exception';
import { AppException } from '../../domain/exceptions/app.exception';

export const RefreshToken = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    const refreshTokenHeader = request.headers['x-refresh-token'];
    const headerToken = Array.isArray(refreshTokenHeader)
      ? refreshTokenHeader[0]
      : refreshTokenHeader;

    const token = request.cookies?.jwtr || headerToken || '';

    if (!token) {
      throw new AppException(AuthEx.MissingRefreshToken);
    }
    return token;
  },
);
