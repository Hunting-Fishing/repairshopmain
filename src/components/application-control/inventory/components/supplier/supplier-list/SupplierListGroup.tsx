import { Globe } from "lucide-react";
import { SupplierCard } from "../SupplierCard";
import type { InventorySupplier } from "../../../types";

interface SupplierListGroupProps {
  region: string;
  suppliers: InventorySupplier[];
}

export function SupplierListGroup({ region, suppliers }: SupplierListGroupProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Globe className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">{region}</h3>
        <span className="text-sm text-muted-foreground">
          ({suppliers.length} suppliers)
        </span>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {suppliers.map((supplier) => (
          <SupplierCard key={supplier.id} supplier={supplier} />
        ))}
      </div>
    </div>
  );
}