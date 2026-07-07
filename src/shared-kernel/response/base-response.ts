import { ErrorItem } from './error-item';

export class BaseResponse<T = unknown> {
  code: string;
  message: string;
  data?: T;
  errors?: ErrorItem[];

  constructor(
    params: {
      data?: T;
      message?: string;
      code?: string;
      errors?: ErrorItem[];
    } = {},
  ) {
    this.code = params.code ?? 'SUCCESS';
    this.message = params.message ?? 'Success';
    this.data = params.data;
    this.errors = params.errors;
  }
}
