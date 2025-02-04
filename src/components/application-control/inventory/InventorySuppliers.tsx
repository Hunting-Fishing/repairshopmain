import { useOrganizationData } from "@/hooks/staff/useOrganizationData";
import { useSuppliers } from "./hooks/useSuppliers";
import { SupplierListContainer } from "./components/supplier/supplier-list/SupplierListContainer";
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
    <SupplierListContainer 
      suppliers={displaySuppliers}
      isLoading={isLoading}
    />
  );
}