import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { AppException, CommonEx } from '../../domain/exceptions';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    const user = request.user;
    if (!user || !user.userId) {
      throw new AppException(CommonEx.Unauthorized);
    }
    return user.userId;
  },
);
