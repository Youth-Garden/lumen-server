import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContextStore {
  userId?: string;
}

export class RequestContext {
  private static readonly storage =
    new AsyncLocalStorage<RequestContextStore>();

  static run(store: RequestContextStore, callback: () => void): void {
    this.storage.run(store, callback);
  }

  static getUserId(): string | undefined {
    return this.storage.getStore()?.userId;
  }
}
