
// Analytics types
export interface SupplierAnalyticsData {
  total_spend: number;
  orders_count: number;
  on_time_delivery_rate: number;
  quality_rating: number;
  orders_fulfilled: number;
  average_delivery_time: number;
  payment_timeliness_score: number;
  inventory_value: number;
  return_rate: number;
  average_lead_time: number;
  daily_spend: number;
  weekly_spend: number;
  monthly_spend: number;
  rebates_amount: number;
  discounts_amount: number;
  bill_out_total: number;
  profit_margin: number;
  order_value_trend: number[];
  delivery_time_trend: number[];
  defect_rate: number;
  negotiated_savings: number;
  early_payment_discounts: number;
  volume_discounts: number;
  seasonal_spend_pattern: {
    Q1: number;
    Q2: number;
    Q3: number;
    Q4: number;
  };
  payment_terms_compliance: number;
  supplier_diversity_status: string | null;
  sustainability_score: number;
  cost_savings_initiatives: any[];
  supply_chain_risk_score: number;
  market_price_variance: number;
  contract_compliance_rate: number;
}

export interface CategoryStats {
  name: string;
  totalItems: number;
  totalValue: number;
  lowStock: number;
}

export interface AnalyticsData {
  categoryStats: CategoryStats[];
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
}
