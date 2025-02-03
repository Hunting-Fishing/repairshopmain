import { useState } from "react";
import { useInventoryQuery } from "./hooks/useInventoryQuery";
import { useInventorySubscription } from "./hooks/useInventorySubscription";
import { InventoryListView } from "./components/InventoryListView";
import { toast } from "sonner";
import { BulkActions } from "./components/BulkActions";
import type { InventoryItem } from "./types";

interface InventoryListProps {
  searchQuery: string;
  filters: {
    lowStock?: boolean;
    outOfStock?: boolean;
    needsReorder?: boolean;
  };
}

type SortField = 'name' | 'quantity_in_stock' | 'unit_cost';
type SortOrder = 'asc' | 'desc';

export function InventoryList({ searchQuery, filters }: InventoryListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const itemsPerPage = 9;

  const { data: itemsData, isLoading, error, refetch } = useInventoryQuery({
    searchQuery,
    filters,
    currentPage,
    itemsPerPage,
    sortField,
    sortOrder,
  });

  useInventorySubscription(refetch);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedItems([]); // Clear selections on page change
    if (error) {
      toast.error("Failed to load inventory items. Please try again.");
    }
  };

  const handleSelectItem = (itemId: string, selected: boolean) => {
    setSelectedItems(prev => 
      selected 
        ? [...prev, itemId]
        : prev.filter(id => id !== itemId)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedItems(selected ? (itemsData?.items || []).map(item => item.id) : []);
  };

  const handleBulkAction = async (action: 'delete' | 'archive' | 'export') => {
    try {
      switch (action) {
        case 'delete':
          toast.error("Bulk delete not implemented yet");
          break;
        case 'archive':
          toast.error("Bulk archive not implemented yet");
          break;
        case 'export':
          toast.error("Export not implemented yet");
          break;
      }
    } catch (error) {
      toast.error("Failed to perform bulk action");
    }
  };

  return (
    <div className="space-y-4">
      {selectedItems.length > 0 && (
        <BulkActions
          selectedCount={selectedItems.length}
          onAction={handleBulkAction}
        />
      )}
      <InventoryListView
        items={itemsData?.items || []}
        isLoading={isLoading}
        error={error as Error | null}
        totalPages={Math.ceil((itemsData?.total || 0) / itemsPerPage)}
        currentPage={currentPage}
        sortField={sortField}
        sortOrder={sortOrder}
        selectedItems={selectedItems}
        onSelectItem={handleSelectItem}
        onSelectAll={handleSelectAll}
        onSort={handleSort}
        onPageChange={handlePageChange}
      />
    </div>
  );
}