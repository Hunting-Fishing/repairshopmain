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
        .maybeSingle();

      if (error) throw error;
      
      // Return default values if no analytics exist
      return data || {
        orders_fulfilled: 0,
        on_time_delivery_rate: 0,
        quality_rating: 0,
        payment_timeliness_score: 0,
        total_spend: 0,
        orders_count: 0,
        average_delivery_time: 0,
        date: new Date().toISOString()
      };
    },
  });

  return {
    analytics,
    isLoading,
  };
}