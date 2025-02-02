import { useState } from "react";
import { useInventoryQuery } from "./hooks/useInventoryQuery";
import { useInventorySubscription } from "./hooks/useInventorySubscription";
import { InventoryListView } from "./components/InventoryListView";
import { toast } from "sonner";

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
    if (error) {
      toast.error("Failed to load inventory items. Please try again.");
    }
  };

  return (
    <InventoryListView
      items={itemsData?.items || []}
      isLoading={isLoading}
      error={error as Error | null}
      totalPages={Math.ceil((itemsData?.total || 0) / itemsPerPage)}
      currentPage={currentPage}
      sortField={sortField}
      sortOrder={sortOrder}
      onSort={handleSort}
      onPageChange={handlePageChange}
    />
  );
}