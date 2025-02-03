import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { SupplierCard } from "./SupplierCard";
import { useSupplierList } from "./hooks/useSupplierList";
import type { InventorySupplier } from "../../types";

interface SupplierListProps {
  suppliers: InventorySupplier[];
  isLoading: boolean;
}

export function SupplierList({ suppliers, isLoading }: SupplierListProps) {
  const { 
    searchQuery, 
    setSearchQuery, 
    sortOrder, 
    setSortOrder, 
    groupedSuppliers, 
    totalSuppliers 
  } = useSupplierList(suppliers);

  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (suppliers.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No suppliers found. Add your first supplier to get started.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {Object.values(groupedSuppliers).flat().map((supplier) => (
        <SupplierCard key={supplier.id} supplier={supplier} />
      ))}
    </div>
  );
}