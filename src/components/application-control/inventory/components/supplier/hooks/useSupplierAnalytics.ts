import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SupplierAnalyticsData } from "../../../types";

export function useSupplierAnalytics(supplierId: string) {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["supplier-analytics", supplierId],
    queryFn: async () => {
      console.log("Fetching analytics for supplier:", supplierId);
      
      const { data, error } = await supabase
        .from("supplier_analytics")
        .select("*")
        .eq("supplier_id", supplierId)
        .order("date", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching supplier analytics:", error);
        throw error;
      }
      
      console.log("Fetched analytics:", data);

      // Provide default values for all fields if no data is found
      const defaultAnalytics: SupplierAnalyticsData = {
        total_spend: 0,
        orders_count: 0,
        on_time_delivery_rate: 0,
        quality_rating: 0,
        orders_fulfilled: 0,
        average_delivery_time: 0,
        payment_timeliness_score: 0,
        inventory_value: 0,
        return_rate: 0,
        average_lead_time: 0,
        daily_spend: 0,
        weekly_spend: 0,
        monthly_spend: 0,
        rebates_amount: 0,
        discounts_amount: 0,
        bill_out_total: 0,
        profit_margin: 0,
        order_value_trend: [],
        delivery_time_trend: [],
        defect_rate: 0,
        negotiated_savings: 0,
        early_payment_discounts: 0,
        volume_discounts: 0,
        seasonal_spend_pattern: { Q1: 0, Q2: 0, Q3: 0, Q4: 0 },
        payment_terms_compliance: 0,
        supplier_diversity_status: null,
        sustainability_score: 0,
        cost_savings_initiatives: [],
        supply_chain_risk_score: 0,
        market_price_variance: 0,
        contract_compliance_rate: 0
      };

      return data || defaultAnalytics;
    },
  });

  return {
    analytics,
    isLoading,
  };
}