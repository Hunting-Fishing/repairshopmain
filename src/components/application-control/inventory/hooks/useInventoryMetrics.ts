
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { logError, handleQueryError } from "@/utils/error-handling";

export function useInventoryMetrics() {
  return useQuery({
    queryKey: ['inventory-metrics'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('inventory_metrics')
          .select('*')
          .order('calculated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        return data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          await logError(error, {
            table_name: 'inventory_metrics',
            action_type: 'query',
          });
          handleQueryError(error, 'load inventory metrics');
        }
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 1000 * 60 * 2,
  });
}
