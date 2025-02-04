import { SupplierList } from "../SupplierList";
import type { InventorySupplier } from "../../../types";

interface SupplierListSectionProps {
  suppliers: InventorySupplier[];
  isLoading: boolean;
  onSupplierClick: (supplier: InventorySupplier) => void;
}

export function SupplierListSection({ 
  suppliers, 
  isLoading, 
  onSupplierClick 
}: SupplierListSectionProps) {
  return (
    <SupplierList 
      suppliers={suppliers} 
      isLoading={isLoading}
      onSupplierClick={onSupplierClick}
      sortField="name"
      sortDirection="asc"
      onSort={() => {}}
    />
  );
}