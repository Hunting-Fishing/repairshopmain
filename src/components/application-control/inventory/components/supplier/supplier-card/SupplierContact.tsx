import { Mail, Phone, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { InventorySupplier } from "../../../types";

interface SupplierContactProps {
  supplier: InventorySupplier;
}

export function SupplierContact({ supplier }: SupplierContactProps) {
  return (
    <div className="pt-4 border-t">
      <div className="flex flex-wrap gap-2">
        {supplier.email && (
          <Badge variant="outline" className="flex items-center gap-1 hover:bg-primary/5 cursor-pointer transition-colors">
            <Mail className="h-3 w-3" />
            <span>{supplier.email}</span>
          </Badge>
        )}
        {supplier.phone && (
          <Badge variant="outline" className="flex items-center gap-1 hover:bg-primary/5 cursor-pointer transition-colors">
            <Phone className="h-3 w-3" />
            <span>{supplier.phone}</span>
          </Badge>
        )}
        {supplier.address && (
          <Badge variant="outline" className="flex items-center gap-1 hover:bg-primary/5 cursor-pointer transition-colors">
            <MapPin className="h-3 w-3" />
            <span>{supplier.address}</span>
          </Badge>
        )}
      </div>
    </div>
  );
}