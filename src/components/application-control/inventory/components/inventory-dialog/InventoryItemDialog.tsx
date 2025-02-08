
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { InventoryForm } from "./InventoryItemForm";
import type { InventoryItem, InventoryItemFormData } from "../../types";

interface InventoryItemDialogProps {
  item?: InventoryItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InventoryItemFormData) => void;
}

export function InventoryItemDialog({
  item,
  open,
  onOpenChange,
  onSubmit,
}: InventoryItemDialogProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        className="w-[1000px] sm:max-w-[1200px] p-0 border-l border-gray-200"
        side="right"
      >
        <SheetHeader className="p-6 border-b border-gray-200 bg-white">
          <SheetTitle className="text-xl font-semibold text-gray-800">
            {item ? 'Edit' : 'Add'} Inventory Item
          </SheetTitle>
        </SheetHeader>
        <InventoryForm 
          item={item} 
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
