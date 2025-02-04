import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Loader2, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SupplierCard } from "./SupplierCard";
import { useSupplierList } from "./hooks/useSupplierList";
import { InventoryPagination } from "../InventoryPagination";
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
    currentPage,
    setCurrentPage,
    itemsPerPage,
    paginatedSuppliers,
    totalPages,
    sortField,
    sortDirection,
    handleSort,
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
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search Suppliers By Name..." 
            className="pl-10 h-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort('name')}
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
            onClick={() => handleSort('rating')}
            className="whitespace-nowrap"
          >
            Rating
            <ArrowUpDown className="ml-2 h-4 w-4" />
            {sortField === 'rating' && (
              <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
            )}
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
        <div>
          Viewing {paginatedSuppliers.length} of {totalSuppliers} suppliers
          {searchQuery && ` (filtered from ${filteredSuppliers.length} results)`}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {paginatedSuppliers.map((supplier) => (
          <SupplierCard 
            key={supplier.id} 
            supplier={supplier}
            onClick={onSupplierClick}
          />
        ))}
      </div>

      <InventoryPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}