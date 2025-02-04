import { useState } from "react";
import { SupplierList } from "../SupplierList";
import { SupplierListHeader } from "./SupplierListHeader";
import { SupplierMetrics } from "./SupplierMetrics";
import { useSupplierFilters } from "../hooks/useSupplierFilters";
import type { InventorySupplier } from "../../../types";

interface SupplierListContainerProps {
  suppliers: InventorySupplier[];
  isLoading: boolean;
  onSupplierClick?: (supplier: InventorySupplier) => void;
}

export function SupplierListContainer({ 
  suppliers, 
  isLoading,
  onSupplierClick 
}: SupplierListContainerProps) {
  const {
    searchQuery,
    setSearchQuery,
    filteredSuppliers,
    sortField,
    sortDirection,
    handleSort
  } = useSupplierFilters(suppliers);

  const activeSuppliers = suppliers.filter(s => s.status === "active").length;
  const totalSpent = suppliers.reduce((sum, s) => sum + (s.total_spent || 0), 0);
  const averageScore = suppliers.reduce((sum, s) => sum + (s.reliability_score || 0), 0) / suppliers.length || 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      <SupplierMetrics 
        activeSuppliers={activeSuppliers}
        totalSpent={totalSpent}
        averageScore={averageScore}
      />

      <SupplierListHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalSuppliers={suppliers.length}
        filteredCount={filteredSuppliers.length}
      />

      <SupplierList 
        suppliers={filteredSuppliers} 
        isLoading={isLoading}
        onSupplierClick={onSupplierClick}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
    </div>
  );
}