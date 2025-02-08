
import { useState } from "react";
import { useInventoryQuery } from "./hooks/useInventoryQuery";
import { useInventorySubscription } from "./hooks/useInventorySubscription";
import { InventoryListView } from "./components/InventoryListView";
import { toast } from "sonner";
import { BulkActions } from "./components/BulkActions";
import { InventoryItemDialog } from "./components/inventory-dialog/InventoryItemDialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | undefined>(undefined);
  const { user } = useAuth();
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
    setSelectedItems([]);
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

  const handleAddItem = () => {
    setSelectedItem(undefined);
    setDialogOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleSubmitItem = async (data: Partial<InventoryItem>) => {
    try {
      if (selectedItem) {
        const { error } = await supabase
          .from('inventory_items')
          .update(data)
          .eq('id', selectedItem.id);

        if (error) throw error;
        toast.success("Item updated successfully");
      } else {
        const { error } = await supabase
          .from('inventory_items')
          .insert([{ ...data, created_by: user?.id }]);

        if (error) throw error;
        toast.success("Item added successfully");
      }
      
      setDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleBulkAction = async (action: 'delete' | 'archive' | 'export') => {
    if (selectedItems.length === 0) {
      toast.error("No items selected");
      return;
    }

    try {
      switch (action) {
        case 'delete':
          await supabase
            .from('inventory_items')
            .delete()
            .in('id', selectedItems);
          break;
        case 'archive':
          await supabase
            .from('inventory_items')
            .update({ status: 'inactive' })
            .in('id', selectedItems);
          break;
        case 'export':
          // Handle export logic
          break;
      }
      setSelectedItems([]);
      toast.success(`Successfully performed ${action} action`);
      refetch();
    } catch (error) {
      toast.error("Failed to perform bulk action");
    }
  };

  return (
    <div className="space-y-4">
      {selectedItems.length > 0 && (
        <BulkActions
          selectedCount={selectedItems.length}
          selectedItems={selectedItems}
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
        onAddItem={handleAddItem}
        onEditItem={handleEditItem}
      />
      <InventoryItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={selectedItem}
        onSubmit={handleSubmitItem}
      />
    </div>
  );
}
