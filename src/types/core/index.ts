
export interface BaseEntity {
  id: string;
  created_at?: string;
  updated_at?: string;
}

export interface BaseError {
  message: string;
  code?: string;
  details?: unknown;
  stack?: string;
  status?: number;
}

export interface QueryResult<T> {
  data: T | null;
  isLoading: boolean;
  error: BaseError | null;
  metadata?: {
    timestamp?: string;
    version?: string;
    params?: Record<string, unknown>;
  };
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface SortState {
  field: string;
  direction: 'asc' | 'desc';
  priority?: number;
}

export interface FilterState {
  [key: string]: string | number | boolean | null | Array<string | number>;
  search?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ViewState {
  pagination: PaginationState;
  sort: SortState;
  filters: FilterState;
}

export interface DataTableState<T> extends ViewState {
  selectedRows: T[];
  searchQuery: string;
  loading: {
    table: boolean;
    filters: boolean;
    export: boolean;
  };
}

export interface ApiResponse<T> {
  data: T | null;
  error: BaseError | null;
  metadata?: {
    pagination?: PaginationState;
    timestamp?: string;
    processingTime?: number;
    params?: Record<string, unknown>;
  };
}

export interface AuditInfo {
  created_by?: string;
  updated_by?: string;
  created_at?: string;
  updated_at?: string;
  version?: number;
  revision_notes?: string;
}

export interface OrganizationEntity extends BaseEntity {
  organization_id: string;
}

export type Status = 'active' | 'inactive' | 'pending' | 'archived' | 'deleted';

export interface Timestamps {
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}
