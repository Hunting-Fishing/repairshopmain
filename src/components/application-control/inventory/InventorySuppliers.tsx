import { useOrganizationData } from "@/hooks/staff/useOrganizationData";
import { useSuppliers } from "./hooks/useSuppliers";
import { SupplierList } from "./components/supplier/SupplierList";
import { AddSupplierDialog } from "./components/supplier/AddSupplierDialog";
import type { InventorySupplier } from "./types";

interface InventorySuppliersProps {
  suppliers?: InventorySupplier[];
}

export function InventorySuppliers({ suppliers = [] }: InventorySuppliersProps) {
  const { userProfile } = useOrganizationData();
  const { 
    suppliers: hookSuppliers, 
    isLoading, 
    error 
  } = useSuppliers(userProfile?.organization_id);
  
  const displaySuppliers = hookSuppliers || suppliers;

  if (!Array.isArray(displaySuppliers)) {
    console.error("InventorySuppliers - suppliers is not an array:", displaySuppliers);
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <AddSupplierDialog />
      </div>
      <SupplierList 
        suppliers={displaySuppliers}
        isLoading={isLoading}
      />
    </div>
  );
}