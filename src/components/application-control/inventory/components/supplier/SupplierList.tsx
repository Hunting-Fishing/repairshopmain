import { SupplierCard } from "./SupplierCard";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { InventorySupplier } from "../../types";

interface SupplierListProps {
  suppliers: InventorySupplier[];
  isLoading: boolean;
}

export function SupplierList({ suppliers, isLoading }: SupplierListProps) {
  console.log("SupplierList - Number of suppliers:", suppliers?.length);
  console.log("SupplierList - Loading state:", isLoading);
  console.log("SupplierList - Suppliers data:", suppliers);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading suppliers...</span>
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
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {suppliers.map((supplier) => (
        <SupplierCard 
          key={supplier.id} 
          supplier={supplier} 
        />
      ))}
    </div>
  );
}