import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {supplier.name}
          </DialogTitle>
        </DialogHeader>

        <SupplierDetailsTabs supplier={supplier} />
      </DialogContent>
    </Dialog>
  );
}