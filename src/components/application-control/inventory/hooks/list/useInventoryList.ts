
import { useState } from "react";
import { useInventoryQuery } from "../../hooks/useInventoryQuery";
import type { InventoryItem } from "../../types";

export function useInventoryList() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'name' | 'quantity_in_stock' | 'unit_cost'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useInventoryQuery({
    searchQuery,
    filters: {},
    currentPage,
    itemsPerPage: 9,
    sortField,
    sortOrder,
  });

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? (data?.items || []).map(item => item.id) : []);
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    setSelectedItems(prev =>
      checked ? [...prev, itemId] : prev.filter(id => id !== itemId)
    );
  };

  const handleSort = (field: 'name' | 'quantity_in_stock' | 'unit_cost') => {
    if (field === sortField) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return {
    items: data?.items || [],
    total: data?.total || 0,
    isLoading,
    error,
    selectedItems,
    currentPage,
    sortField,
    sortOrder,
    searchQuery,
    setSearchQuery,
    handleSelectAll,
    handleSelectItem,
    handleSort,
    setCurrentPage,
  };
}
