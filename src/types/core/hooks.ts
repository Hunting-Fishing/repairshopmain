
import type { BaseError, QueryResult } from './index';

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
