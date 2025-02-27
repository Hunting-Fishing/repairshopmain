
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { logError, handleQueryError } from "@/utils/error-handling";

export interface StatData {
  id: string;
  type: string;
  value: number;
  trend: number;
  trend_direction: boolean;
  created_at: string;
  updated_at: string;
}

// Cache key factory to ensure consistent keys
export const statsQueryKeys = {
  all: ['stats'] as const,
  lists: () => [...statsQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...statsQueryKeys.all, 'detail', id] as const,
  byType: (type: string) => [...statsQueryKeys.all, 'by-type', type] as const,
};

export function useStatsQuery() {
  return useQuery({
    queryKey: statsQueryKeys.lists(),
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('stats')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;

        // Early return empty array if no data
        if (!data || data.length === 0) {
          return [] as StatData[];
        }

        // Type safety transformation with improved performance
        return data.map(item => ({
          id: item.id,
          type: item.type,
          value: Number(item.value),
          trend: Number(item.trend),
          trend_direction: Boolean(item.trend_direction),
          created_at: item.created_at,
          updated_at: item.updated_at
        })) as StatData[];
      } catch (error: unknown) {
        if (error instanceof Error) {
          await logError(error, {
            table_name: 'stats',
            action_type: 'query',
          });
          handleQueryError(error, 'fetch statistics');
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in garbage collection for 30 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
