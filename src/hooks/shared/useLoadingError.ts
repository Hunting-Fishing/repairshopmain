
import { useState } from 'react';
import type { BaseError } from '@/types/core';
import type { UseLoadingState, UseErrorState } from '@/types/core/hooks';

export function useLoadingError(): UseLoadingState & UseErrorState {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<BaseError | null>(null);

  return {
    isLoading,
    setIsLoading,
    error,
    setError,
  };
}
