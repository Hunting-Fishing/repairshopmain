
import { useState } from "react";
import { useInventoryQuery } from "../../hooks/useInventoryQuery";
import { InventoryListView } from "../InventoryListView";
import { toast } from "sonner";
import type { InventoryItem } from "../../types";

export function InventoryList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'name' | 'quantity_in_stock' | 'unit_cost'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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

  const handleAddItem = () => {
    toast.info("Add item functionality not implemented yet");
  };

  const handleEditItem = (item: InventoryItem) => {
    toast.info("Edit item functionality not implemented yet");
  };

  return (
    <InventoryListView
      items={data?.items || []}
      isLoading={isLoading}
      error={error}
      totalPages={Math.ceil((data?.total || 0) / 9)}
      currentPage={currentPage}
      sortField={sortField}
      sortOrder={sortOrder}
      selectedItems={selectedItems}
      onSelectItem={handleSelectItem}
      onSelectAll={handleSelectAll}
      onSort={handleSort}
      onPageChange={setCurrentPage}
      onAddItem={handleAddItem}
      onEditItem={handleEditItem}
    />
  );
}
