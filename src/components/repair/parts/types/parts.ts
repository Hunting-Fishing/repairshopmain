
interface Part {
  id: string;
  repair_job_id: string;
  part_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes?: string;
  inventory_item: {
    name: string;
    sku: string;
  };
}

interface PartFormData {
  part_id: string;
  quantity: number;
}

export type { Part, PartFormData };
