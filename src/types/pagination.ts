export interface IPaginationQuery {
  page: number;
  limit: number;
}
export interface IMetaPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IPaginationResult<T> {
  data: T[];
  meta: IMetaPagination;
}
