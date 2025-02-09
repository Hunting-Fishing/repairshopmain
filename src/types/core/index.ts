
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

export interface DataTableState<T> extends ViewState {
  selectedRows: T[];
  searchQuery: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: BaseError | null;
  metadata?: {
    pagination?: PaginationState;
    timestamp?: string;
  };
}

export interface AuditInfo {
  created_by?: string;
  updated_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrganizationEntity extends BaseEntity {
  organization_id: string;
}
