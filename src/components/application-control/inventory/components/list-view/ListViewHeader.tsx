
import { Checkbox } from "@/components/ui/checkbox";
import { InventorySort } from "../InventorySort";
import type { InventoryItem } from "../../types";

interface ListViewHeaderProps {
  allSelected: boolean;
  someSelected: boolean;
  selectedCount: number;
  sortField: 'name' | 'quantity_in_stock' | 'unit_cost';
  sortOrder: 'asc' | 'desc';
  onSelectAll: (checked: boolean) => void;
  onSort: (field: 'name' | 'quantity_in_stock' | 'unit_cost') => void;
}

export function ListViewHeader({
  allSelected,
  someSelected,
  selectedCount,
  sortField,
  sortOrder,
  onSelectAll,
  onSort,
}: ListViewHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={allSelected}
          indeterminate={someSelected}
          onCheckedChange={onSelectAll}
        />
        <span className="text-sm text-muted-foreground">
          {selectedCount} selected
        </span>
      </div>
      <InventorySort
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={onSort}
      />
    </div>
  );
}
