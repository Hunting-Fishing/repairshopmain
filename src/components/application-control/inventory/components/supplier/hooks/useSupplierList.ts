import { useState, useMemo, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import type { InventorySupplier } from "../../../types";

export function useSupplierList(suppliers: InventorySupplier[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Debounced search handler
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setDebouncedSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  }, 300);

  // Update both the immediate and debounced search terms
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(supplier => {
      const searchTerm = debouncedSearchTerm.toLowerCase();
      return (
        supplier.name.toLowerCase().includes(searchTerm) ||
        supplier.contact_person?.toLowerCase().includes(searchTerm) ||
        supplier.email?.toLowerCase().includes(searchTerm)
      );
    });
  }, [suppliers, debouncedSearchTerm]);

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  
  const paginatedSuppliers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSuppliers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSuppliers, currentPage, itemsPerPage]);

  return {
    filteredSuppliers,
    totalSuppliers: suppliers.length,
    searchQuery,
    setSearchQuery: handleSearchChange,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    paginatedSuppliers,
    totalPages,
  };
}