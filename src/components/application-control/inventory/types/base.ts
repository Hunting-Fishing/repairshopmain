
import { Database } from "@/integrations/supabase/types";

// Base types from database
export type InventoryCategory = Database["public"]["Tables"]["inventory_categories"]["Row"];
export type InventoryItem = Database["public"]["Tables"]["inventory_items"]["Row"] & {
  image_url?: string;
  vehicle_type?: string;
  unit_of_measure?: string;
  lead_time_days?: number;
  weight?: number;
  dimensions?: string;
  date_received?: string;
  purchase_order_number?: string;
  sales_order_number?: string;
  return_info?: string;
  notes?: string;
  preferred_vendor?: string;
  upc_ean?: string;
};

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
  vehicle_type?: string;
  unit_of_measure?: string;
  lead_time_days?: number;
  weight?: number;
  dimensions?: string;
  date_received?: string;
  purchase_order_number?: string;
  sales_order_number?: string;
  return_info?: string;
  notes?: string;
  preferred_vendor?: string;
  upc_ean?: string;
}
