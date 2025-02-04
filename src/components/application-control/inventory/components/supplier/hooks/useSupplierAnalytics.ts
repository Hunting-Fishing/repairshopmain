import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SupplierAnalyticsData } from "../../../types";

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
        .maybeSingle();

      if (error) throw error;
      
      return data as SupplierAnalyticsData;
    },
  });

  return {
    analytics,
    isLoading,
  };
}