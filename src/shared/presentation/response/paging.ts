export class PagingMeta {
  constructor(
    public offset: number,
    public limit: number,
    public total: number,
  ) {}
}

export class PagedData<T> {
  constructor(
    public items: T[],
    public paging: PagingMeta,
  ) {}
}
