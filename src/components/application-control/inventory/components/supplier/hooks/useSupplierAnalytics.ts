import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSupplierAnalytics(supplierId: string) {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["supplier-analytics", supplierId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("supplier_analytics")
        .select("*")
        .eq("supplier_id", supplierId)
        .order("date", { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    },
  });

  return {
    analytics,
    isLoading,
  };
}