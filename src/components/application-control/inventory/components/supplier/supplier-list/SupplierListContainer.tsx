import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SupplierList } from "../../supplier/SupplierList";
import { SupplierHeader } from "./SupplierHeader";
import { SupplierActions } from "./SupplierActions";
import { SupplierMetrics } from "./SupplierMetrics";
import { useSupplierFilters } from "../hooks/useSupplierFilters";
import type { InventorySupplier } from "../../../types";

interface SupplierListContainerProps {
  suppliers: InventorySupplier[];
  isLoading: boolean;
}

export function SupplierListContainer({ suppliers, isLoading }: SupplierListContainerProps) {
  const {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    filteredSuppliers
  } = useSupplierFilters(suppliers);

  const activeSuppliers = suppliers.filter(s => s.status === "active").length;
  const totalSpent = suppliers.reduce((sum, s) => sum + (s.total_spent || 0), 0);
  const averageScore = suppliers.reduce((sum, s) => sum + (s.reliability_score || 0), 0) / suppliers.length || 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      <div className="flex justify-between items-center">
        <SupplierHeader />
        <SupplierActions 
          onFilterChange={setFilterStatus}
          onSortChange={setSortField}
        />
      </div>

      <SupplierMetrics 
        activeSuppliers={activeSuppliers}
        totalSpent={totalSpent}
        averageScore={averageScore}
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Search suppliers by name, contact person, or email..." 
          className="pl-10 h-12 text-lg bg-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{filteredSuppliers.length}</span> of {suppliers.length} suppliers
        </div>
        <div className="flex gap-2">
          {filterStatus && (
            <Badge variant="outline" className="bg-primary/5">
              Status: {filterStatus}
            </Badge>
          )}
          <Badge variant="outline" className="bg-primary/5">
            Sort: {sortField} ({sortDirection})
          </Badge>
        </div>
      </div>

      <SupplierList 
        suppliers={filteredSuppliers} 
        isLoading={isLoading} 
      />
    </div>
  );
}