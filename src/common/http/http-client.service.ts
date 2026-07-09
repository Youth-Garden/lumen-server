import { Injectable } from '@nestjs/common';
import axios, { type AxiosRequestConfig } from 'axios';

/**
 * HttpClientService wraps axios as an injectable NestJS service.
 * Use this instead of importing axios directly anywhere in the codebase.
 */
@Injectable()
export class HttpClientService {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axios.get<T>(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await axios.post<T>(url, data, config);
    return response.data;
  }
}
