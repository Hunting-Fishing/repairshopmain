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

// Error types
export interface InventoryError {
  message: string;
  code?: string;
}

// Response types
export interface InventoryResponse<T> {
  data: T | null;
  error: InventoryError | null;
  isLoading: boolean;
}