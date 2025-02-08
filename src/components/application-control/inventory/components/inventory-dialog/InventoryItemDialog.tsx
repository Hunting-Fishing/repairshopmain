
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
        className="w-[500px] sm:max-w-[600px] overflow-y-auto"
        side="right"
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold">
            {item ? 'Edit' : 'Add'} Inventory Item
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <InventoryForm 
            item={item} 
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
