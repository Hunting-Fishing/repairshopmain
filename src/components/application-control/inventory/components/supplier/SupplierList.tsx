import { SupplierCard } from "./SupplierCard";
import { Card, CardContent } from "@/components/ui/card";
import type { InventorySupplier } from "../../types";

interface SupplierListProps {
  suppliers: InventorySupplier[];
  isLoading: boolean;
}

export function SupplierList({ suppliers, isLoading }: SupplierListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Loading suppliers...
        </CardContent>
      </Card>
    );
  }

  if (!suppliers || suppliers.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No suppliers found. Add your first supplier to get started.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {suppliers.map((supplier) => (
        <SupplierCard key={supplier.id} supplier={supplier} />
      ))}
    </div>
  );
}