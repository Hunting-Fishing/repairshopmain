import { Mail, Phone, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { InventorySupplier } from "../../../types";

interface SupplierContactProps {
  supplier: InventorySupplier;
}

export function SupplierContact({ supplier }: SupplierContactProps) {
  return (
    <div className="mt-4 pt-4 border-t">
      <div className="flex flex-wrap gap-2">
        {supplier.email && (
          <Badge variant="outline" className="flex items-center gap-1">
            <Mail className="h-4 w-4" />
            <span>{supplier.email}</span>
          </Badge>
        )}
        {supplier.phone && (
          <Badge variant="outline" className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            <span>{supplier.phone}</span>
          </Badge>
        )}
        {supplier.address && (
          <Badge variant="outline" className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{supplier.address}</span>
          </Badge>
        )}
      </div>
    </div>
  );
}