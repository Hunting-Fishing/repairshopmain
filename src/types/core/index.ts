
export interface BaseEntity {
  id: string;
  created_at?: string;
  updated_at?: string;
}

export interface BaseError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface QueryResult<T> {
  data: T | null;
  isLoading: boolean;
  error: BaseError | null;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems?: number;
  totalPages?: number;
}

export interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterState {
  [key: string]: string | number | boolean | null;
}

export interface ViewState {
  pagination: PaginationState;
  sort: SortState;
  filters: FilterState;
}
