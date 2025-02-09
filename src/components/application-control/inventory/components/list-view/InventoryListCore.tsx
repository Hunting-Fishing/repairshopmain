
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { InventoryListHeader } from "../InventoryListHeader";
import { VirtualizedList } from "./VirtualizedList";
import { InventoryPagination } from "../InventoryPagination";
import type { InventoryItem } from "../../types";

interface InventoryListCoreProps {
  items: InventoryItem[];
  totalPages: number;
  currentPage: number;
  selectedItems: string[];
  onSelectItem: (itemId: string, selected: boolean) => void;
  onPageChange: (page: number) => void;
  onEditItem: (item: InventoryItem) => void;
}

export function InventoryListCore({
  items,
  totalPages,
  currentPage,
  selectedItems,
  onSelectItem,
  onPageChange,
  onEditItem,
}: InventoryListCoreProps) {
  if (!items?.length) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>No inventory items found.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <VirtualizedList
        items={items}
        selectedItems={selectedItems}
        onSelectItem={onSelectItem}
        onEditItem={onEditItem}
      />
      <InventoryPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
