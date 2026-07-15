import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { AppException } from '../../domain/exceptions/app.exception';
import { AuthEx } from '../../../contexts/iam/domain/exceptions/auth.exception';

export const RefreshToken = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    const token =
      request.cookies?.jwtr ||
      (Array.isArray(request.headers['x-refresh-token'])
        ? request.headers['x-refresh-token'][0]
        : request.headers['x-refresh-token']) ||
      '';

    if (!token) {
      throw new AppException(AuthEx.MissingRefreshToken);
    }
    return token;
  },
);
