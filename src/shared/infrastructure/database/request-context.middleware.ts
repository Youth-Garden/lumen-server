import { Injectable, NestMiddleware } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { RequestContext } from './request-context';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(
    req: FastifyRequest['raw'],
    _res: FastifyReply['raw'],
    next: () => void,
  ): void {
    const fastifyReq = req as FastifyRequest['raw'] & {
      user?: { userId: string; role: string };
    };
    const userId = fastifyReq.user?.userId;

    RequestContext.run({ userId }, next);
  }
}
