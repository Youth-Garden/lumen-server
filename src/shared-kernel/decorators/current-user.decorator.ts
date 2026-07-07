import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { AppException, CommonEx } from '../exceptions';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx
      .switchToHttp()
      .getRequest<FastifyRequest & { user?: { userId: string } }>();
    if (!request.user || !request.user.userId) {
      throw new AppException(CommonEx.Unauthorized);
    }
    return request.user.userId;
  },
);
