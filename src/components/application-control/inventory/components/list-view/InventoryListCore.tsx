
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { InventoryListHeader } from "../InventoryListHeader";
import { VirtualizedList } from "./VirtualizedList";
import { InventoryPagination } from "../InventoryPagination";
import { ListViewHeader } from "./ListViewHeader";
import type { InventoryItem } from "../../types";

interface InventoryListCoreProps {
  items: InventoryItem[];
  totalPages: number;
  currentPage: number;
  selectedItems: string[];
  sortField: 'name' | 'quantity_in_stock' | 'unit_cost';
  sortOrder: 'asc' | 'desc';
  onSelectItem: (itemId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onSort: (field: 'name' | 'quantity_in_stock' | 'unit_cost') => void;
  onPageChange: (page: number) => void;
  onEditItem: (item: InventoryItem) => void;
}

export function InventoryListCore({
  items,
  totalPages,
  currentPage,
  selectedItems,
  sortField,
  sortOrder,
  onSelectItem,
  onSelectAll,
  onSort,
  onPageChange,
  onEditItem,
}: InventoryListCoreProps) {
  if (!items?.length) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>No inventory items found.</AlertDescription>
      </Alert>
    );
  }

  const allSelected = items.length > 0 && selectedItems.length === items.length;
  const someSelected = selectedItems.length > 0 && selectedItems.length < items.length;

  return (
    <div className="space-y-4">
      <ListViewHeader
        allSelected={allSelected}
        someSelected={someSelected}
        selectedCount={selectedItems.length}
        sortField={sortField}
        sortOrder={sortOrder}
        onSelectAll={onSelectAll}
        onSort={onSort}
      />
      <VirtualizedList
        items={items}
        selectedItems={selectedItems}
        onSelectItem={onSelectItem}
        onEditItem={onEditItem}
      />
      <InventoryPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
