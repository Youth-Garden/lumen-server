import { ValidationPipe, ValidationError } from '@nestjs/common';
import { AppException, CommonEx } from '../exceptions';
import { ErrorItem } from '../response/error-item';

export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    exceptionFactory: (errors: ValidationError[]) => {
      const errorItems = errors.map(
        (err) =>
          new ErrorItem(
            Object.values(err.constraints ?? {}).join(', '),
            err.property,
          ),
      );

      return new AppException({
        ...CommonEx.ValidationError,
        errors: errorItems,
      });
    },
  });
}
