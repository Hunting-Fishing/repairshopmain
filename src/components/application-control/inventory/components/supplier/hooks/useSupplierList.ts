import { useState, useMemo } from "react";
import type { InventorySupplier } from "../../../types";

interface UseSupplierListReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  filterStatus: string | null;
  setFilterStatus: (status: string | null) => void;
  groupedSuppliers: Record<string, InventorySupplier[]>;
  filteredSuppliers: InventorySupplier[];
  totalSuppliers: number;
}

export function useSupplierList(suppliers: InventorySupplier[]): UseSupplierListReturn {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filteredSuppliers = useMemo(() => {
    if (!suppliers) return [];

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
        const comparison = a.name.localeCompare(b.name);
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [suppliers, searchQuery, sortOrder, filterStatus]);

  const groupedSuppliers = useMemo(() => {
    return filteredSuppliers.reduce((acc, supplier) => {
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
  }, [filteredSuppliers]);

  const totalSuppliers = Object.values(groupedSuppliers).reduce(
    (total, suppliers) => total + suppliers.length,
    0
  );

  return {
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    filterStatus,
    setFilterStatus,
    groupedSuppliers,
    filteredSuppliers,
    totalSuppliers
  };
}