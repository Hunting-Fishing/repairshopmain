import { InventoryCard } from "./InventoryCard";
import { InventorySort } from "./InventorySort";
import { InventoryPagination } from "./InventoryPagination";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
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

  if (!items?.length) return (
    <div className="text-center py-8 text-muted-foreground">
      No items found. Try adjusting your search or filters.
    </div>
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