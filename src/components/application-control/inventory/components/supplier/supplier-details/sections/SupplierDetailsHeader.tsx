import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin } from "lucide-react";
import type { InventorySupplier } from "../../../../types";

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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
        {supplier.email && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>{supplier.email}</span>
          </div>
        )}
        {supplier.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>{supplier.phone}</span>
          </div>
        )}
        {supplier.address && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{supplier.address}</span>
          </div>
        )}
      </div>
    </DialogHeader>
  );
}