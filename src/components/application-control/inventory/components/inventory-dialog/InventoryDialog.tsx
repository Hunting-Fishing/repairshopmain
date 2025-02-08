
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { InventoryForm } from "./InventoryItemForm";
import { InventoryItem } from "../../types";

interface InventoryDialogProps {
  item?: InventoryItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<InventoryItem>) => void;
}

export function InventoryDialog({
  item,
  open,
  onOpenChange,
  onSubmit,
}: InventoryDialogProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>{item ? 'Edit' : 'Add'} Inventory Item</SheetTitle>
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
