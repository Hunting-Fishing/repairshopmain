import { useState, useMemo } from "react";
import type { InventorySupplier } from "../../../types";

export function useSupplierFilters(suppliers: InventorySupplier[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof InventorySupplier>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof InventorySupplier) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredSuppliers = useMemo(() => {
    return suppliers
      .filter(supplier => {
        const matchesSearch = 
          supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          supplier.contact_person?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          supplier.email?.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (filterStatus && supplier.status !== filterStatus) {
          return false;
        }
        
        return matchesSearch;
      })
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        const direction = sortDirection === "asc" ? 1 : -1;
        
        if (typeof aValue === "string" && typeof bValue === "string") {
          return direction * aValue.localeCompare(bValue);
        }
        return 0;
      });
  }, [suppliers, searchQuery, filterStatus, sortField, sortDirection]);

  return {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    filteredSuppliers,
    handleSort
  };
}