export interface InventoryItemFormData {
  name: string;
  sku: string;
  description?: string;
  category_id?: string;
  supplier_id?: string;
  quantity_in_stock: number;
  unit_cost?: number;
  selling_price?: number;
  reorder_point?: number;
  location?: string;
}