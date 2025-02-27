
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

export function useStatsQuery() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('stats')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;

        console.log('Fetched stats:', data);
        return data as StatData[];
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
    gcTime: 1000 * 60 * 30, // Keep in garbage collection for 30 minutes (formerly cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
