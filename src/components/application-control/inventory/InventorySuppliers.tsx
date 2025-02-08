
import { useState } from "react";
import { useOrganizationData } from "@/hooks/staff/useOrganizationData";
import { useSuppliers } from "./hooks/useSuppliers";
import { SupplierErrorBoundary } from "./components/supplier/SupplierErrorBoundary";
import { SupplierListView } from "./components/supplier/supplier-list/SupplierListView";
import { SupplierDetailsView } from "./components/supplier/supplier-details/SupplierDetailsView";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import type { InventorySupplier } from "./types";

interface InventorySuppliersProps {
  initialSuppliers?: InventorySupplier[];
}

export function InventorySuppliers({ initialSuppliers }: InventorySuppliersProps) {
  const { userProfile } = useOrganizationData();
  const [selectedSupplier, setSelectedSupplier] = useState<InventorySupplier | null>(null);
  
  const { suppliers, isLoading, error } = useSuppliers(userProfile?.organization_id);

  const suppliersList = initialSuppliers || suppliers;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <SupplierErrorBoundary error={error} />;
  if (!Array.isArray(suppliersList)) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Invalid suppliers data</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {selectedSupplier ? (
        <div className="space-y-6">
          <Button
            variant="outline"
            onClick={() => setSelectedSupplier(null)}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to List
          </Button>
          <SupplierDetailsView 
            supplier={selectedSupplier}
            onClose={() => setSelectedSupplier(null)}
          />
        </div>
      ) : (
        <SupplierListView
          suppliers={suppliersList}
          isLoading={isLoading}
          onSupplierClick={setSelectedSupplier}
        />
      )}
    </div>
  );
}
