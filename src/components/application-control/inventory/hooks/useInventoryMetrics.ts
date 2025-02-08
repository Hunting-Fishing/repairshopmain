
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

      if (error) throw error;
      return data;
    },
  });
}
