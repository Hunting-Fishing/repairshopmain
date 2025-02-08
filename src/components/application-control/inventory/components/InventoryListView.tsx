
import { InventoryCard } from "./InventoryCard";
import { InventorySort } from "./InventorySort";
import { InventoryPagination } from "./InventoryPagination";
import { AlertCircle, Filter, Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { InventoryItem } from "../types";

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
}: InventoryListViewProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 320,
    overscan: 5,
  });

  useEffect(() => {
    rowVirtualizer.measure();
  }, [items, rowVirtualizer]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-[280px] w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Failed to load inventory items: {error.message}
      </AlertDescription>
    </Alert>
  );

  const allSelected = items.length > 0 && selectedItems.length === items.length;
  const someSelected = selectedItems.length > 0 && selectedItems.length < items.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center gap-4">
          <Button className="gap-2 bg-green-500 hover:bg-green-600">
            <Plus className="h-4 w-4" />
            New Order
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Input
            placeholder="Search orders..."
            className="max-w-xs"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
            <span className="font-medium">{items.length}</span>
            <span>orders</span>
          </div>
          <div className="flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-lg">
            <span className="font-medium">
              {items.filter(item => item.status === 'needs_attention').length}
            </span>
            <span>urgent</span>
          </div>
          <div className="flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-lg">
            <span className="font-medium">
              {items.filter(item => item.quantity_in_stock <= (item.reorder_point || 5)).length}
            </span>
            <span>low stock</span>
          </div>
        </div>
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
          <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 absolute top-0 left-0 w-full">
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const item = items[virtualRow.index];
              return (
                <div
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  style={{
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <InventoryCard
                    item={item}
                    selected={selectedItems.includes(item.id)}
                    onSelect={(selected) => onSelectItem(item.id, selected)}
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
