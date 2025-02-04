import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SupplierDetailsTabs } from "./SupplierDetailsTabs";
import { useEffect } from "react";
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
  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Clean up any subscriptions or pending state updates
      onOpenChange(false);
    };
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <SupplierDetailsTabs supplier={supplier} />
      </DialogContent>
    </Dialog>
  );
}