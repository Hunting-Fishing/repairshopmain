
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { InventoryItem } from "../../types";
import { InventoryListHeader } from "../InventoryListHeader";
import { InventoryStats } from "../InventoryStats";
import { ListViewHeader } from "./ListViewHeader";
import { InventoryListCore } from "./InventoryListCore";

interface InventoryListViewProps {
  items: InventoryItem[];
  isLoading: boolean;
  error: Error | null;
  totalPages: number;
  currentPage: number;
  sortField: 'name' | 'quantity_in_stock' | 'unit_cost';
  sortOrder: 'asc' | 'desc';
  selectedItems: string[];
  onSelectItem: (itemId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onSort: (field: 'name' | 'quantity_in_stock' | 'unit_cost') => void;
  onPageChange: (page: number) => void;
  onAddItem: () => void;
  onEditItem: (item: InventoryItem) => void;
}

export function InventoryListView({
  items,
  isLoading,
  error,
  totalPages,
  currentPage,
  sortField,
  sortOrder,
  selectedItems,
  onSelectItem,
  onSelectAll,
  onSort,
  onPageChange,
  onAddItem,
  onEditItem,
}: InventoryListViewProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[280px]" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  const allSelected = items.length > 0 && selectedItems.length === items.length;
  const someSelected = selectedItems.length > 0 && selectedItems.length < items.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <InventoryListHeader onAddItem={onAddItem} />
        <InventoryStats items={items} />
      </div>

      <ListViewHeader
        allSelected={allSelected}
        someSelected={someSelected}
        selectedCount={selectedItems.length}
        sortField={sortField}
        sortOrder={sortOrder}
        onSelectAll={onSelectAll}
        onSort={onSort}
      />

      <InventoryListCore
        items={items}
        totalPages={totalPages}
        currentPage={currentPage}
        selectedItems={selectedItems}
        onSelectItem={onSelectItem}
        onPageChange={onPageChange}
        onEditItem={onEditItem}
      />
    </div>
  );
}
