
interface Part {
  id: string;
  inventory_item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes: string;
  inventory_item: {
    name: string;
    sku: string;
  };
}

interface PartFormData {
  inventory_item_id: string;
  quantity: number;
}

export type { Part, PartFormData };
