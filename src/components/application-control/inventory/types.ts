import { Database } from "@/integrations/supabase/types";

// Base types from database
export type InventoryCategory = Database["public"]["Tables"]["inventory_categories"]["Row"];
export type InventoryItem = Database["public"]["Tables"]["inventory_items"]["Row"] & {
  image_url?: string;
};
export type InventorySupplier = Database["public"]["Tables"]["inventory_suppliers"]["Row"];

export type InventoryItemStatus = 'active' | 'inactive' | 'needs_attention';

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

// Automation types
export interface SupplierAutomationSettings {
  reorder_threshold: number;
  payment_reminder_days: number;
  contract_reminder_days: number;
  notification_preferences: {
    email: boolean;
    in_app: boolean;
  };
  auto_reorder: boolean;
  min_stock_threshold: number;
  preferred_delivery_days: string[];
  auto_payment: boolean;
}

// Communication types
export interface SupplierMessage {
  id: string;
  message_type: string;
  message_content: string;
  created_at: string;
  status: string;
  priority: string;
  category: string;
  response_required: boolean;
  due_date?: string;
}

// Document types
export interface SupplierDocument {
  id: string;
  document_type: string;
  file_name: string;
  file_url: string;
  uploaded_at: string;
  status: string;
  notes?: string;
}

// Transaction types
export interface SupplierTransaction {
  id: string;
  transaction_type: string;
  amount: number;
  currency: string;
  status: string;
  payment_method?: string;
  reference_number?: string;
  notes?: string;
  created_at: string;
}

// Form data types
export interface CategoryFormData {
  name: string;
  description?: string;
  parent_id?: string;
}

export interface InventoryItemFormData {
  name: string;
  sku?: string;
  description?: string;
  category_id?: string;
  supplier_id?: string;
  quantity_in_stock?: number;
  reorder_point?: number;
  reorder_quantity?: number;
  unit_cost?: number;
  selling_price?: number;
  location?: string;
  barcode?: string;
  status?: InventoryItemStatus;
  image_url?: string;
}

// UI specific types
export interface InventoryFilter {
  category?: string;
  supplier?: string;
  lowStock?: boolean;
  search?: string;
}

export interface InventorySort {
  field: keyof InventoryItem;
  direction: 'asc' | 'desc';
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

export interface InventoryItemWithCategory extends InventoryItem {
  category?: {
    name: string | null;
  } | null;
}

// Error and Response types
export interface InventoryError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface InventoryResponse<T> {
  data: T | null;
  error: InventoryError | null;
  isLoading: boolean;
}

export type InventoryBatchOperation = {
  id: string;
  organization_id: string;
  created_by: string;
  operation_type: 'delete' | 'archive' | 'export';
  items: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
  error_message?: string;
  metadata: Record<string, any>;
};

export type InventoryNotification = {
  id: string;
  organization_id: string;
  inventory_item_id?: string;
  message: string;
  alert_type: 'low_stock' | 'out_of_stock' | 'reorder' | 'price_change';
  priority: 'low' | 'normal' | 'high';
  status: 'unread' | 'read';
  created_at: string;
  read_at?: string;
  threshold_value?: number;
  current_value?: number;
  metadata: Record<string, any>;
};
