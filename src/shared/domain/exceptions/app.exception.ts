/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorItem } from '../../presentation/response/error-item';

export interface ErrorDefinition {
  code: string;
  message: string;
  httpStatus: number;
  errors?: ErrorItem[];
}

export type ExceptionMap = Record<
  string,
  ErrorDefinition | ((...args: any[]) => ErrorDefinition)
>;

export class AppException extends Error {
  public readonly code: string;
  public readonly httpStatus: number;
  public readonly errors?: ErrorItem[];

  constructor(errorDef: ErrorDefinition) {
    super(errorDef.message);
    this.code = errorDef.code;
    this.httpStatus = errorDef.httpStatus;
    this.errors = errorDef.errors;
    this.name = 'AppException';
  }
}
