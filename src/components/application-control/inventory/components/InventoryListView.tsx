import { InventoryCard } from "./InventoryCard";
import { InventorySort } from "./InventorySort";
import { InventoryPagination } from "./InventoryPagination";
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
  onSort,
  onPageChange,
}: InventoryListViewProps) {
  if (isLoading) return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-[200px] bg-gray-100 rounded-lg" />
        </div>
      ))}
    </div>
  );

  if (error) return (
    <div className="text-center text-red-500 py-8">
      Error loading inventory: {error.message}
    </div>
  );

  if (!items?.length) return (
    <div className="text-center py-8">No items found</div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <InventorySort
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={onSort}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <InventoryCard key={item.id} item={item} />
        ))}
      </div>

      <InventoryPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}