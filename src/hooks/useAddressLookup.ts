
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';

interface AddressResult {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    house_number?: string;
    road?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

interface AddressError {
  message: string;
  code: 'RATE_LIMIT' | 'NETWORK_ERROR' | 'API_ERROR';
}

const DEBOUNCE_TIME = 800; // Increased from 500ms
const MIN_SEARCH_LENGTH = 3;
const MAX_RETRIES = 3;

export function useAddressLookup(searchQuery: string) {
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // Memoize the debounced function
  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => {
      setDebouncedSearch(value);
    }, DEBOUNCE_TIME),
    []
  );

  const { data: suggestions, isLoading, error } = useQuery({
    queryKey: ['address-lookup', debouncedSearch],
    queryFn: async ({ signal }) => {
      if (!debouncedSearch || debouncedSearch.length < MIN_SEARCH_LENGTH) return [];
      
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(debouncedSearch)}&format=json&addressdetails=1`,
          {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'YourApp/1.0'
            },
            signal
          }
        );

        // Handle rate limiting
        if (response.status === 429) {
          throw {
            message: 'Too many requests. Please try again in a moment.',
            code: 'RATE_LIMIT'
          } as AddressError;
        }

        if (!response.ok) {
          throw {
            message: 'Failed to fetch address suggestions',
            code: 'API_ERROR'
          } as AddressError;
        }

        const data: AddressResult[] = await response.json();
        return data;
      } catch (err) {
        if (err instanceof Error) {
          throw {
            message: err.message,
            code: 'NETWORK_ERROR'
          } as AddressError;
        }
        throw err;
      }
    },
    enabled: debouncedSearch.length >= MIN_SEARCH_LENGTH,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60,
    retry: (failureCount, error: any) => {
      // Don't retry on rate limits
      if (error.code === 'RATE_LIMIT') return false;
      // Retry other errors up to MAX_RETRIES times
      return failureCount < MAX_RETRIES;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const errorMessage = useMemo(() => {
    if (!error) return null;
    const err = error as AddressError;
    
    switch (err.code) {
      case 'RATE_LIMIT':
        return 'Too many searches. Please wait a moment before trying again.';
      case 'NETWORK_ERROR':
        return 'Network error. Please check your connection.';
      case 'API_ERROR':
        return 'Unable to search addresses. Please try again later.';
      default:
        return 'An unexpected error occurred.';
    }
  }, [error]);

  return {
    suggestions,
    isLoading,
    error: errorMessage,
    updateSearch: debouncedSetSearch
  };
}
