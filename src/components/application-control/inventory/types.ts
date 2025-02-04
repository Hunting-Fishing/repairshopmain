import { Database } from "@/integrations/supabase/types";

// Base types from database
export type InventoryCategory = Database["public"]["Tables"]["inventory_categories"]["Row"];
export type InventoryItem = Database["public"]["Tables"]["inventory_items"]["Row"];
export type InventorySupplier = Database["public"]["Tables"]["inventory_suppliers"]["Row"];

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
