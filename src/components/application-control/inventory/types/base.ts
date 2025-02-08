
import { Database } from "@/integrations/supabase/types";

// Base types from database
export type InventoryCategory = Database["public"]["Tables"]["inventory_categories"]["Row"];
export type InventoryItem = Database["public"]["Tables"]["inventory_items"]["Row"] & {
  image_url?: string;
};
export type InventorySupplier = Database["public"]["Tables"]["inventory_suppliers"]["Row"];

export type InventoryItemStatus = 'active' | 'inactive' | 'needs_attention';

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
