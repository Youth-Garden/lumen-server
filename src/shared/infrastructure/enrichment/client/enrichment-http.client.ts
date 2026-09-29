import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { EnrichmentEndpointEnum } from '../constants/enrichment-endpoint.enum';

export interface HttpRequestOptions {
  params?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  timeoutMs?: number;
  body?: unknown;
}

export abstract class BaseHttpClient {
  private static readonly DEFAULT_USER_AGENT =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  protected async get<T>(
    endpoint: EnrichmentEndpointEnum | string,
    options: HttpRequestOptions = {},
  ): Promise<T | null> {
    return this.request<T>('GET', endpoint, options);
  }

  protected async post<T>(
    endpoint: EnrichmentEndpointEnum | string,
    options: HttpRequestOptions = {},
  ): Promise<T | null> {
    return this.request<T>('POST', endpoint, options);
  }

  protected async put<T>(
    endpoint: EnrichmentEndpointEnum | string,
    options: HttpRequestOptions = {},
  ): Promise<T | null> {
    return this.request<T>('PUT', endpoint, options);
  }

  protected async delete<T>(
    endpoint: EnrichmentEndpointEnum | string,
    options: HttpRequestOptions = {},
  ): Promise<T | null> {
    return this.request<T>('DELETE', endpoint, options);
  }

  protected async patch<T>(
    endpoint: EnrichmentEndpointEnum | string,
    options: HttpRequestOptions = {},
  ): Promise<T | null> {
    return this.request<T>('PATCH', endpoint, options);
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: EnrichmentEndpointEnum | string,
    options: HttpRequestOptions = {},
  ): Promise<T | null> {
    try {
      const headers = {
        'User-Agent': BaseHttpClient.DEFAULT_USER_AGENT,
        ...options.headers,
      };
      const timeout = options.timeoutMs ?? 5000;

      let response: AxiosResponse<T>;
      if (method === 'GET') {
        response = await axios.get<T>(endpoint, {
          headers,
          params: options.params,
          timeout,
        });
      } else {
        const config: AxiosRequestConfig = {
          method,
          url: endpoint,
          timeout,
          headers,
          params: options.params,
          data: options.body,
        };
        response = await axios.request<T>(config);
      }
      return response.data;
    } catch {
      return null;
    }
  }

  protected buildPathUrl(
    endpoint: EnrichmentEndpointEnum | string,
    pathSuffix: string,
  ): string {
    const cleanEndpoint = endpoint.replace(/\/$/, '');
    const cleanSuffix = pathSuffix.replace(/^\//, '');
    return `${cleanEndpoint}/${encodeURIComponent(cleanSuffix)}`;
  }
}
