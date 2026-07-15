import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { AppException } from '../../domain/exceptions/app.exception';
import { AuthEx } from '../../../contexts/iam/domain/exceptions/auth.exception';

export const RefreshToken = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();

    const token = request.cookies?.['jwtr'];

    if (!token) {
      throw new AppException(AuthEx.MissingRefreshToken);
    }

    return token;
  },
);
