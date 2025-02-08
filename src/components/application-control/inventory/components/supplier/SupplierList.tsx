
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SupplierCard } from "./SupplierCard";
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

  const sortableFields: Array<{ field: keyof InventorySupplier; label: string }> = [
    { field: 'name', label: 'Name' },
    { field: 'rating', label: 'Rating' },
    { field: 'total_spent', label: 'Total Spent' },
    { field: 'fulfillment_rate', label: 'Fulfillment Rate' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {sortableFields.map(({ field, label }) => (
          <Button
            key={field}
            variant="outline"
            size="sm"
            onClick={() => onSort(field)}
            className="whitespace-nowrap"
          >
            {label}
            <ArrowUpDown className="ml-2 h-4 w-4" />
            {sortField === field && (
              <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
            )}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
