import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Globe } from "lucide-react";
import { SupplierCard } from "./SupplierCard";
import { SupplierListHeader } from "./supplier-list/SupplierListHeader";
import { SupplierListGroup } from "./supplier-list/SupplierListGroup";
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
      <Card>
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading suppliers...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <SupplierListHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        totalSuppliers={totalSuppliers}
      />
      
      {Object.entries(groupedSuppliers).map(([region, regionSuppliers]) => (
        <SupplierListGroup 
          key={region} 
          region={region} 
          suppliers={regionSuppliers} 
        />
      ))}
    </div>
  );
}