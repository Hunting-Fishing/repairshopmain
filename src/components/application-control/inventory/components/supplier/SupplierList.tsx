import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { SupplierCard } from "./SupplierCard";
import { useSupplierList } from "./hooks/useSupplierList";
import type { InventorySupplier } from "../../types";

interface SupplierListProps {
  suppliers: InventorySupplier[];
  isLoading: boolean;
  onSupplierClick?: (supplier: InventorySupplier) => void;
}

export function SupplierList({ suppliers, isLoading, onSupplierClick }: SupplierListProps) {
  const { 
    filteredSuppliers,
    totalSuppliers,
    searchQuery,
    setSearchQuery,
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
    <div className="space-y-6">
      <div className="relative">
        <div className="relative rounded-lg border border-input bg-white">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search Suppliers By Name..." 
            className="pl-10 h-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
        <div>
          Viewing {filteredSuppliers.length} of {totalSuppliers} suppliers
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredSuppliers.map((supplier) => (
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