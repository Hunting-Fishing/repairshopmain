
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import type { InventoryItem } from "../types";
import { InventoryCard } from "./InventoryCard";
import { InventorySort } from "./InventorySort";
import { InventoryPagination } from "./InventoryPagination";
import { InventoryListHeader } from "./InventoryListHeader";
import { InventoryStats } from "./InventoryStats";

interface InventoryListViewProps {
  items: (InventoryItem & {
    category?: { name: string } | null;
    supplier?: { name: string } | null;
  })[];
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
  const parentRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[280px]" />
        ))}
      </div>
    );
  }

  if (error) return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 320,
    overscan: 5,
  });

  const allSelected = items.length > 0 && selectedItems.length === items.length;
  const someSelected = selectedItems.length > 0 && selectedItems.length < items.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <InventoryListHeader onAddItem={onAddItem} />
        <InventoryStats items={items} />
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={allSelected}
            indeterminate={someSelected}
            onCheckedChange={onSelectAll}
          />
          <span className="text-sm text-muted-foreground">
            {selectedItems.length} selected
          </span>
        </div>
        <InventorySort
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={onSort}
        />
      </div>

      <div 
        ref={parentRef} 
        className="h-[800px] overflow-auto bg-white rounded-lg shadow-sm border"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-3 absolute top-0 left-0 w-full">
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const item = items[virtualRow.index];
              return (
                <div
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  className="relative"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <InventoryCard
                    item={item}
                    selected={selectedItems.includes(item.id)}
                    onSelect={(selected) => onSelectItem(item.id, selected)}
                    onEdit={() => onEditItem(item)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <InventoryPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
