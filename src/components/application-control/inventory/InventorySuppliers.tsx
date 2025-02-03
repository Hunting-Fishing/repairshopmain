import { Building2 } from "lucide-react";
import { AddSupplierDialog } from "./components/supplier/AddSupplierDialog";
import { SupplierList } from "./components/supplier/SupplierList";
import type { InventorySupplier } from "./types";

interface InventorySuppliersProps {
  suppliers: InventorySupplier[];
}

export function InventorySuppliers({ suppliers }: InventorySuppliersProps) {
  console.log("InventorySuppliers - Number of suppliers:", suppliers?.length);

  if (!Array.isArray(suppliers)) {
    console.error("InventorySuppliers - suppliers is not an array:", suppliers);
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-2xl font-bold tracking-tight">Suppliers</h2>
          </div>
          <p className="text-muted-foreground">
            Manage your inventory suppliers and their contact information
          </p>
        </div>
        <AddSupplierDialog />
      </div>

      <SupplierList 
        suppliers={suppliers} 
        isLoading={false} 
      />
    </div>
  );
}