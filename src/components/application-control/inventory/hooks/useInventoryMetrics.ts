
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useInventoryMetrics() {
  return useQuery({
    queryKey: ['inventory-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_metrics')
        .select('*')
        .order('calculated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        // Log error to audit_logs
        await supabase.from('audit_logs').insert({
          action_type: 'error',
          table_name: 'inventory_metrics',
          error_message: error.message,
          level: 'error',
        });
        throw error;
      }

      return data;
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 1000 * 60 * 2, // Cache for 2 minutes
  });
}
