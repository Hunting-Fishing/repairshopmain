import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SupplierCard } from "./SupplierCard";
import { useSupplierList } from "./hooks/useSupplierList";
import { InventoryPagination } from "../InventoryPagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        
        <div className="grid gap-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-8 w-24" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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

  if (filteredSuppliers.length === 0 && searchQuery) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search Suppliers By Name..." 
              className="pl-10 h-12"
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
        
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <p>No suppliers found matching "{searchQuery}". Try adjusting your search.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search Suppliers By Name..." 
            className="pl-10 h-12"
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