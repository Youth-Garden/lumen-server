import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { BaseResponse } from '../response/base-response';

@Injectable()
export class ResponseWrapperInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<BaseResponse> {
    return next.handle().pipe(
      map((result: unknown) => {
        if (result instanceof BaseResponse) return result;
        return new BaseResponse({ data: result });
      }),
    );
  }
}
