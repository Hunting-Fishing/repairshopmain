import { useState, useMemo, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import type { InventorySupplier } from "../../../types";

export function useSupplierList(suppliers: InventorySupplier[]) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Debounced search implementation
  const debouncedSearch = useDebouncedCallback(
    (value: string) => {
      setSearchQuery(value);
      setCurrentPage(1);
    },
    300
  );

  const filteredSuppliers = useMemo(() => {
    const searchTerm = searchQuery.toLowerCase();
    return suppliers.filter(supplier => 
      supplier.name.toLowerCase().includes(searchTerm) ||
      supplier.contact_person?.toLowerCase().includes(searchTerm) ||
      supplier.email?.toLowerCase().includes(searchTerm)
    );
  }, [suppliers, searchQuery]);

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  
  const paginatedSuppliers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSuppliers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSuppliers, currentPage, itemsPerPage]);

  return {
    filteredSuppliers,
    totalSuppliers: suppliers.length,
    searchQuery,
    setSearchQuery: debouncedSearch,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    paginatedSuppliers,
    totalPages,
  };
}