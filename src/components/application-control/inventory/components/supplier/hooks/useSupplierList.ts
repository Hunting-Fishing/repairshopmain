import { useState, useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";
import type { InventorySupplier } from "../../../types";

type SortField = keyof InventorySupplier;
type SortDirection = 'asc' | 'desc';

export function useSupplierList(suppliers: InventorySupplier[]) {
  // Initialize all state hooks at the top level
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const itemsPerPage = 10;

  // Create debounced search handler
  const debouncedSearch = useDebouncedCallback(
    (value: string) => {
      setSearchQuery(value);
      setCurrentPage(1);
    },
    300
  );

  // Filter and sort suppliers
  const filteredSuppliers = useMemo(() => {
    const searchTerm = searchQuery.toLowerCase();
    return suppliers
      .filter(supplier => 
        supplier.name.toLowerCase().includes(searchTerm) ||
        (supplier.contact_person?.toLowerCase() || "").includes(searchTerm) ||
        (supplier.email?.toLowerCase() || "").includes(searchTerm)
      )
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? 1 : -1;
        if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? -1 : 1;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' 
            ? aValue - bValue
            : bValue - aValue;
        }

        return 0;
      });
  }, [suppliers, searchQuery, sortField, sortDirection]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  
  // Get current page items
  const paginatedSuppliers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSuppliers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSuppliers, currentPage, itemsPerPage]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

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
    sortField,
    sortDirection,
    handleSort,
  };
}