import { useState, useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";
import type { InventorySupplier, SupplierAnalyticsData } from "../../../types";

export function useSupplierList(suppliers: InventorySupplier[]) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<keyof InventorySupplier>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const itemsPerPage = 10;

  const debouncedSearch = useDebouncedCallback(
    (value: string) => {
      setSearchQuery(value);
      setCurrentPage(1);
    },
    300
  );

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

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  
  const paginatedSuppliers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSuppliers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSuppliers, currentPage, itemsPerPage]);

  const handleSort = (field: keyof InventorySupplier) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Calculate aggregated analytics
  const analytics: SupplierAnalyticsData | null = useMemo(() => {
    if (!suppliers.length) return null;

    return {
      total_spend: suppliers.reduce((sum, s) => sum + (s.total_spent || 0), 0),
      orders_count: suppliers.length,
      on_time_delivery_rate: suppliers.reduce((sum, s) => sum + (s.fulfillment_rate || 0), 0) / suppliers.length,
      quality_rating: suppliers.reduce((sum, s) => sum + (s.rating || 0), 0) / suppliers.length,
      orders_fulfilled: suppliers.reduce((sum, s) => sum + (s.fulfillment_rate ? 1 : 0), 0),
      average_delivery_time: 0,
      payment_timeliness_score: 0,
      inventory_value: 0,
      return_rate: 0,
      average_lead_time: 0
    };
  }, [suppliers]);

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
    analytics
  };
}