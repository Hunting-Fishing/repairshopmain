
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
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
        className="w-[1000px] sm:max-w-[1200px] overflow-hidden p-0 bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 border-l border-border/20"
        side="right"
      >
        <SheetHeader className="p-0" />
        <InventoryForm 
          item={item} 
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
