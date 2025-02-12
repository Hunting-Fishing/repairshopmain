
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface HistoryEntry {
  id: string;
  customer_id: string;
  changed_by: string;
  change_type: string;
  field_name: string;
  old_value: string | null;
  new_value: string | null;
  notes: string | null;
  created_at: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
  };
}

export function useCustomerHistory(customerId: string) {
  const { data: historyEntries, isLoading } = useQuery({
    queryKey: ["customer-history", customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_history")
        .select(`
          *,
          profiles:changed_by (
            first_name,
            last_name
          )
        `)
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to fetch customer history");
        throw error;
      }

      return data as HistoryEntry[];
    },
    enabled: !!customerId,
  });

  return {
    historyEntries,
    isLoading,
  };
}
