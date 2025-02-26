
import { Database } from "@/integrations/supabase/types";

// Base types from database
export type InventoryCategory = Database["public"]["Tables"]["inventory_categories"]["Row"];
export type InventoryItem = Database["public"]["Tables"]["inventory_items"]["Row"];
export type InventoryItemStatus = Database["public"]["Enums"]["inventory_item_status"];
export type UnitOfMeasure = Database["public"]["Enums"]["unit_of_measure"];
export type AutomotiveCategory = Database["public"]["Enums"]["automotive_category"];

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
  markup_percentage?: number;
  location?: string;
  barcode?: string;
  status?: InventoryItemStatus;
  image_url?: string;
  unit_of_measure?: UnitOfMeasure;
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
  automotive_category?: AutomotiveCategory;
}

export interface InventorySupplier {
  id: string;
  organization_id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  status: 'active' | 'inactive';
  payment_status?: string;
  tax_id?: string;
  payment_method?: string;
  credit_limit?: number;
  currency?: string;
  total_spent?: number;
  last_order_date?: string;
  last_payment_date?: string;
  rating?: number;
  reliability_score?: number;
  fulfillment_rate?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  payment_terms?: {
    type: string;
    discount: number | null;
  };
}

export interface CategoryFormData {
  name: string;
  description?: string;
  parent_id?: string;
}
