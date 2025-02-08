
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { InventoryItemForm } from "./InventoryItemForm";
import type { InventoryItem } from "../../types";

interface InventoryItemDialogProps {
  item?: InventoryItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<InventoryItem>) => void;
}

export function InventoryItemDialog({
  item,
  open,
  onOpenChange,
  onSubmit,
}: InventoryItemDialogProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>{item ? 'Edit' : 'Add'} Inventory Item</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <InventoryItemForm 
            item={item} 
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
