
import { useState } from "react";
import { useInventoryQuery } from "./hooks/useInventoryQuery";
import { InventoryListView } from "./components/InventoryListView";
import { InventoryItemDialog } from "./components/inventory-dialog/InventoryItemDialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { InventoryItem, InventoryItemFormData } from "./types";

export function InventoryList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'name' | 'quantity_in_stock' | 'unit_cost'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | undefined>(undefined);
  const { user } = useAuth();

  const { data, isLoading, error, refetch } = useInventoryQuery({
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
    setSelectedItem(undefined);
    setDialogOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleSubmitItem = async (formData: InventoryItemFormData) => {
    try {
      const data = {
        ...formData,
        created_by: user?.id,
        organization_id: user?.organization_id,
      } as Partial<InventoryItem>;

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
          .insert([data]);

        if (error) throw error;
        toast.success("Item added successfully");
      }
      
      setDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <>
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
      <InventoryItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={selectedItem}
        onSubmit={handleSubmitItem}
      />
    </>
  );
}
