
import { useInventoryList } from "../../hooks/list/useInventoryList";
import { InventoryListView } from "../InventoryListView";
import { InventoryItemDialog } from "../inventory-dialog/InventoryItemDialog";
import { useState } from "react";
import { useInventorySubmit } from "../../hooks/form/useInventorySubmit";
import type { InventoryItem } from "../../types";

export function ListContainer() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | undefined>(undefined);
  const { handleSubmit } = useInventorySubmit();
  
  const {
    items,
    total,
    isLoading,
    error,
    selectedItems,
    currentPage,
    sortField,
    sortOrder,
    handleSelectAll,
    handleSelectItem,
    handleSort,
    setCurrentPage,
  } = useInventoryList();

  const handleAddItem = () => {
    setSelectedItem(undefined);
    setDialogOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  return (
    <>
      <InventoryListView
        items={items}
        isLoading={isLoading}
        error={error}
        totalPages={Math.ceil(total / 9)}
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
        onSubmit={handleSubmit}
      />
    </>
  );
}
