import { Mail, Phone, MapPin } from "lucide-react";
import type { InventorySupplier } from "../../../types";

interface SupplierContactProps {
  supplier: InventorySupplier;
}

export function SupplierContact({ supplier }: SupplierContactProps) {
  return (
    <div className="space-y-2">
      {supplier.email && (
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <a href={`mailto:${supplier.email}`} className="hover:underline">
            {supplier.email}
          </a>
        </div>
      )}
      {supplier.phone && (
        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <a href={`tel:${supplier.phone}`} className="hover:underline">
            {supplier.phone}
          </a>
        </div>
      )}
      {supplier.address && (
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{supplier.address}</span>
        </div>
      )}
    </div>
  );
}