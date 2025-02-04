import { Box, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { InventorySupplier } from "../../../types";

interface SupplierHeaderProps {
  supplier: InventorySupplier;
}

export function SupplierHeader({ supplier }: SupplierHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold truncate">{supplier.name}</h3>
          <Badge variant={supplier.status === 'active' ? 'default' : 'secondary'}>
            {supplier.status}
          </Badge>
          {supplier.payment_status && (
            <Badge variant={supplier.payment_status === 'active' ? 'default' : 'destructive'}>
              {supplier.payment_status}
            </Badge>
          )}
        </div>
        {supplier.contact_person && (
          <p className="text-sm text-muted-foreground mt-1">{supplier.contact_person}</p>
        )}
      </div>
      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
        <ExternalLink className="h-4 w-4" />
      </Button>
    </div>
  );
}