import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SupplierDetailsHeader } from "./sections/SupplierDetailsHeader";
import { SupplierDetailsTabs } from "./SupplierDetailsTabs";
import type { InventorySupplier } from "../../../types";

interface SupplierDetailsDialogProps {
  supplier: InventorySupplier;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SupplierDetailsDialog({ 
  supplier,
  open,
  onOpenChange,
}: SupplierDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <SupplierDetailsHeader supplier={supplier} />
        <SupplierDetailsTabs supplier={supplier} />
      </DialogContent>
    </Dialog>
  );
}