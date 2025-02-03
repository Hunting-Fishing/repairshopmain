import { useState, useMemo } from "react";
import type { InventorySupplier } from "../../../types";

export function useSupplierList(suppliers: InventorySupplier[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const groupedSuppliers = useMemo(() => {
    if (!suppliers) return {};

    const filtered = suppliers.filter(supplier => 
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.notes?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sorted = filtered.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted.reduce((acc, supplier) => {
      const country = supplier.address?.toLowerCase().includes('canada') 
        ? 'Canada' 
        : supplier.address?.toLowerCase().includes('usa') || supplier.address?.toLowerCase().includes('united states')
          ? 'USA' 
          : 'International';

      if (!acc[country]) {
        acc[country] = [];
      }
      acc[country].push(supplier);
      return acc;
    }, {} as Record<string, InventorySupplier[]>);
  }, [suppliers, searchQuery, sortOrder]);

  const totalSuppliers = Object.values(groupedSuppliers).reduce(
    (total, suppliers) => total + suppliers.length,
    0
  );

  return {
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    groupedSuppliers,
    totalSuppliers
  };
}