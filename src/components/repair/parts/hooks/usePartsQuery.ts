
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Part } from "../types/parts";

export function usePartsQuery(repairJobId: string) {
  return useQuery({
    queryKey: ['repair-parts', repairJobId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('repair_job_parts')
        .select(`
          *,
          inventory_item:inventory_item_id (name, sku)
        `)
        .eq('repair_job_id', repairJobId);

      if (error) throw error;
      return data as Part[];
    }
  });
}
