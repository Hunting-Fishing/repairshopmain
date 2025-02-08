
import { Trash2, Archive, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBatchOperations } from "../hooks/useBatchOperations";
import { toast } from "sonner";
import type { InventoryBatchOperation } from "../types";

interface BulkActionsProps {
  selectedCount: number;
  selectedItems: string[];
  onAction: (action: InventoryBatchOperation['operation_type']) => void;
}

export function BulkActions({ selectedCount, selectedItems, onAction }: BulkActionsProps) {
  const { createBatchOperation } = useBatchOperations();

  const handleAction = async (action: InventoryBatchOperation['operation_type']) => {
    try {
      await createBatchOperation.mutateAsync({
        operation_type: action,
        items: selectedItems,
      });
      onAction(action);
    } catch (error) {
      toast.error("Failed to perform bulk action");
    }
  };

  return (
    <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
      <div className="text-sm text-muted-foreground">
        {selectedCount} items selected
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAction('export')}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAction('archive')}
          className="flex items-center gap-2"
        >
          <Archive className="h-4 w-4" />
          Archive
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleAction('delete')}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}
