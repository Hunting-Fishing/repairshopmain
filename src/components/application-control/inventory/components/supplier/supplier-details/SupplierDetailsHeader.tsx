import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { InventorySupplier } from "../../../types";

interface SupplierDetailsHeaderProps {
  supplier: InventorySupplier;
}

export function SupplierDetailsHeader({ supplier }: SupplierDetailsHeaderProps) {
  return (
    <DialogHeader className="space-y-4">
      <div className="flex items-center justify-between">
        <DialogTitle className="text-2xl font-bold">
          {supplier.name}
        </DialogTitle>
        <div className="flex gap-2">
          <Badge variant={supplier.status === 'active' ? 'default' : 'secondary'}>
            {supplier.status}
          </Badge>
          {supplier.payment_status && (
            <Badge variant={supplier.payment_status === 'active' ? 'default' : 'destructive'}>
              {supplier.payment_status}
            </Badge>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        {supplier.contact_person && (
          <span className="flex items-center gap-2">
            Contact: {supplier.contact_person}
          </span>
        )}
        {supplier.email && (
          <span className="flex items-center gap-2">
            Email: {supplier.email}
          </span>
        )}
      </div>
    </DialogHeader>
  );
}