import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SupplierCard } from "./SupplierCard";
import { InventoryPagination } from "../InventoryPagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { InventorySupplier } from "../../types";

interface SupplierListProps {
  suppliers: InventorySupplier[];
  isLoading: boolean;
  onSupplierClick?: (supplier: InventorySupplier) => void;
  sortField: keyof InventorySupplier;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof InventorySupplier) => void;
}

export function SupplierList({ 
  suppliers, 
  isLoading, 
  onSupplierClick,
  sortField,
  sortDirection,
  onSort
}: SupplierListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!Array.isArray(suppliers)) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          There was an error loading the suppliers. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (suppliers.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <p>No suppliers found. Add your first supplier to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSort('name')}
          className="whitespace-nowrap"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
          {sortField === 'name' && (
            <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSort('rating')}
          className="whitespace-nowrap"
        >
          Rating
          <ArrowUpDown className="ml-2 h-4 w-4" />
          {sortField === 'rating' && (
            <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {suppliers.map((supplier) => (
          <SupplierCard 
            key={supplier.id} 
            supplier={supplier}
            onClick={onSupplierClick}
          />
        ))}
      </div>
    </div>
  );
}