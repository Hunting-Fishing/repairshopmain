
import { useState } from 'react';
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

export function useAddressLookup(searchQuery: string) {
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // Debounce the search to avoid too many API calls
  const debouncedSetSearch = debounce((value: string) => {
    setDebouncedSearch(value);
  }, 500);

  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['address-lookup', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch || debouncedSearch.length < 3) return [];
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(debouncedSearch)}&format=json&addressdetails=1`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'YourApp/1.0' // Required by Nominatim's terms of use
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch address suggestions');
      const data: AddressResult[] = await response.json();
      return data;
    },
    enabled: debouncedSearch.length >= 3,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 60, // Keep in garbage collection for 1 hour
  });

  return {
    suggestions,
    isLoading,
    updateSearch: debouncedSetSearch
  };
}
