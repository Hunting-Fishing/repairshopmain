import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { SupplierCard } from "./SupplierCard";
import { useSupplierList } from "./hooks/useSupplierList";
import { SupplierListHeader } from "./supplier-list/SupplierListHeader";
import type { InventorySupplier } from "../../types";

interface SupplierListProps {
  suppliers: InventorySupplier[];
  isLoading: boolean;
}

export function SupplierList({ suppliers, isLoading }: SupplierListProps) {
  const { 
    groupedSuppliers,
    totalSuppliers,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    filterStatus,
    setFilterStatus
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
    <div className="space-y-8">
      <SupplierListHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        totalSuppliers={totalSuppliers}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />
      
      {Object.entries(groupedSuppliers).map(([region, regionSuppliers]) => (
        <div key={region} className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span>{region}</span>
            <span className="text-sm text-muted-foreground">
              ({regionSuppliers.length} suppliers)
            </span>
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {regionSuppliers.map((supplier) => (
              <SupplierCard key={supplier.id} supplier={supplier} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}