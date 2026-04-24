export interface PageableMeta {
  page: number;
  take: number;
  total: number;
}

export interface PageableResponse<T> {
  data: T[];
  meta: PageableMeta;
}