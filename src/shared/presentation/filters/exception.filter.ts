import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { AppException, CommonEx } from '../../domain/exceptions';
import { BaseResponse } from '../response/base-response';
import { ErrorItem } from '../response/error-item';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();

    // 1. Domain Exceptions
    if (exception instanceof AppException) {
      void reply.status(exception.httpStatus).send(
        new BaseResponse({
          code: exception.code,
          message: exception.message,
          errors: exception.errors ?? [new ErrorItem(exception.message)],
        }),
      );
      return;
    }

    // 2. Standard NestJS Http Exceptions
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();

      let message = exception.message;
      let errorItems: ErrorItem[] = [];

      if (typeof response === 'object' && response !== null) {
        const resObj = response as Record<string, unknown>;

        if (typeof resObj.message === 'string') {
          message = resObj.message;
        } else if (typeof resObj.error === 'string') {
          message = resObj.error;
        }

        if (Array.isArray(resObj.message)) {
          errorItems = resObj.message.map((msg) => new ErrorItem(String(msg)));
          message = 'Validation failed';
        } else {
          errorItems = [new ErrorItem(message)];
        }
      } else {
        errorItems = [new ErrorItem(message)];
      }

      void reply.status(status).send(
        new BaseResponse({
          code: `HTTP_ERROR_${status}`,
          message: message,
          errors: errorItems,
        }),
      );
      return;
    }

    // 3. Unhandled System Exceptions
    this.logger.error('Unhandled Exception:', exception);

    void reply.status(CommonEx.InternalError.httpStatus).send(
      new BaseResponse({
        code: CommonEx.InternalError.code,
        message: CommonEx.InternalError.message,
        errors: [new ErrorItem(CommonEx.InternalError.message)],
      }),
    );
  }
}
