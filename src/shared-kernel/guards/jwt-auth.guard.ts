import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppException, CommonEx } from '../exceptions';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<TUser = unknown>(err: unknown, user: unknown): TUser {
    if (err || !user) {
      if (err instanceof Error) {
        throw err;
      }
      throw new AppException(CommonEx.Unauthorized);
    }
    return user as TUser;
  }
}
