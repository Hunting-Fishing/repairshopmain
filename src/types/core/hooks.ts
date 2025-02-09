
import type { BaseError, QueryResult, PaginationState, SortState, FilterState } from './index';

export interface UseQueryOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: BaseError) => void;
  enabled?: boolean;
}

export interface UseMutationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: BaseError) => void;
  onSettled?: () => void;
}

export interface UseLoadingState {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export interface UseErrorState {
  error: BaseError | null;
  setError: (error: BaseError | null) => void;
}

export interface UsePaginationState extends PaginationState {
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  setTotalItems: (total: number) => void;
}

export interface UseSortState extends SortState {
  setField: (field: string) => void;
  setDirection: (direction: 'asc' | 'desc') => void;
  toggleDirection: () => void;
}

export interface UseFilterState {
  filters: FilterState;
  setFilter: (key: string, value: string | number | boolean | null) => void;
  removeFilter: (key: string) => void;
  clearFilters: () => void;
}
