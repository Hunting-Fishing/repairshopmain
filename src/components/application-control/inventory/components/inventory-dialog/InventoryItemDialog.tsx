
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
        className="w-[800px] sm:max-w-[900px] overflow-y-auto bg-[#F8FAFC] border-l border-gray-200"
        side="right"
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold text-gray-800 px-4">
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
