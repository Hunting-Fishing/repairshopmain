import { Building2 } from "lucide-react";
import { AddSupplierDialog } from "./components/supplier/AddSupplierDialog";
import { SupplierList } from "./components/supplier/SupplierList";
import { useSuppliers } from "./hooks/useSuppliers";
import { useOrganizationData } from "@/hooks/staff/useOrganizationData";
import type { InventorySupplier } from "./types";

interface InventorySuppliersProps {
  suppliers: InventorySupplier[];
}

export function InventorySuppliers({ suppliers }: InventorySuppliersProps) {
  const { organization } = useOrganizationData();
  const { suppliers: hookSuppliers, isLoading, error } = useSuppliers(organization?.id);
  
  console.log("InventorySuppliers - Props suppliers:", suppliers?.length);
  console.log("InventorySuppliers - Hook suppliers:", hookSuppliers?.length);
  console.log("InventorySuppliers - Organization ID:", organization?.id);

  // Use hook suppliers if available, fallback to props
  const displaySuppliers = hookSuppliers || suppliers;

  if (!Array.isArray(displaySuppliers)) {
    console.error("InventorySuppliers - suppliers is not an array:", displaySuppliers);
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
        suppliers={displaySuppliers} 
        isLoading={isLoading} 
      />
    </div>
  );
}