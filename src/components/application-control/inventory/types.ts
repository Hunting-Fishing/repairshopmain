export interface InventoryCategory {
  id: string;
  name: string;
  description?: string;
  organization_id: string;
  parent_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InventoryItem {
  id: string;
  organization_id: string;
  sku?: string;
  name: string;
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
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface InventorySupplier {
  id: string;
  organization_id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InventoryItemFormData {
  name: string;
  sku?: string;
  description?: string;
  category_id?: string;
  supplier_id?: string;
  quantity_in_stock?: number;
  unit_cost?: number;
  selling_price?: number;
  reorder_point?: number;
  location?: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  parent_id?: string;
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

export interface InventoryItemWithCategory {
  id: string;
  name: string;
  quantity_in_stock: number | null;
  unit_cost: number | null;
  reorder_point: number | null;
  category: {
    name: string | null;
  } | null;
}
