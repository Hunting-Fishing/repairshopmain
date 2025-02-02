import { Database } from "@/integrations/supabase/types";

// Base types from database
export type InventoryItem = Database["public"]["Tables"]["inventory_items"]["Row"];
export type InventoryCategory = Database["public"]["Tables"]["inventory_categories"]["Row"];
export type InventorySupplier = Database["public"]["Tables"]["inventory_suppliers"]["Row"];

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