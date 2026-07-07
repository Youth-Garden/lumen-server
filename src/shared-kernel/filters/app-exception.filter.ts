import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { AppException } from '../exceptions/app.exception';
import { BaseResponse } from '../response/base-response';
import { ErrorItem } from '../response/error-item';

@Catch(AppException)
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: AppException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();

    void reply.status(exception.httpStatus).send(
      new BaseResponse({
        code: exception.code,
        message: exception.message,
        errors: exception.errors ?? [new ErrorItem(exception.message)],
      }),
    );
  }
}
