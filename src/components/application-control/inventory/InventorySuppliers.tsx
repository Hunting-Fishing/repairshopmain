import { useOrganizationData } from "@/hooks/staff/useOrganizationData";
import { useSuppliers } from "./hooks/useSuppliers";
import { SupplierList } from "./components/supplier/SupplierList";
import { AddSupplierDialog } from "./components/supplier/AddSupplierDialog";
import { SupplierDetailsDialog } from "./components/supplier/supplier-details/SupplierDetailsDialog";
import { SupplierErrorBoundary } from "./components/supplier/SupplierErrorBoundary";
import { useState } from "react";
import type { InventorySupplier } from "./types";

interface InventorySuppliersProps {
  suppliers?: InventorySupplier[];
}

export function InventorySuppliers({ suppliers = [] }: InventorySuppliersProps) {
  const { userProfile } = useOrganizationData();
  const [selectedSupplier, setSelectedSupplier] = useState<InventorySupplier | null>(null);
  
  const { 
    suppliers: hookSuppliers, 
    isLoading, 
    error 
  } = useSuppliers(userProfile?.organization_id);
  
  const displaySuppliers = hookSuppliers || suppliers;

  if (!Array.isArray(displaySuppliers)) {
    console.error("InventorySuppliers - suppliers is not an array:", displaySuppliers);
    return <SupplierErrorBoundary error={new Error("Invalid suppliers data")} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <SupplierErrorBoundary error={error} />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Suppliers</h1>
          <p className="text-muted-foreground">
            Manage your supplier relationships and inventory sources
          </p>
        </div>
        <AddSupplierDialog />
      </div>
      
      <SupplierList 
        suppliers={displaySuppliers}
        isLoading={isLoading}
        onSupplierClick={setSelectedSupplier}
      />

      {selectedSupplier && (
        <SupplierDetailsDialog
          supplier={selectedSupplier}
          open={!!selectedSupplier}
          onOpenChange={() => setSelectedSupplier(null)}
        />
      )}
    </div>
  );
}