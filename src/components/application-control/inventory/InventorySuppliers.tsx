import { Building2, Search } from "lucide-react";
import { AddSupplierDialog } from "./components/supplier/AddSupplierDialog";
import { SupplierList } from "./components/supplier/SupplierList";
import { useSuppliers } from "./hooks/useSuppliers";
import { useOrganizationData } from "@/hooks/staff/useOrganizationData";
import { Input } from "@/components/ui/input";
import type { InventorySupplier } from "./types";

interface InventorySuppliersProps {
  suppliers: InventorySupplier[];
}

export function InventorySuppliers({ suppliers }: InventorySuppliersProps) {
  const { userProfile } = useOrganizationData();
  const { suppliers: hookSuppliers, isLoading, error } = useSuppliers(userProfile?.organization_id);
  
  console.log("InventorySuppliers - Props suppliers:", suppliers?.length);
  console.log("InventorySuppliers - Hook suppliers:", hookSuppliers?.length);
  console.log("InventorySuppliers - Organization ID:", userProfile?.organization_id);

  // Use hook suppliers if available, fallback to props
  const displaySuppliers = hookSuppliers || suppliers;

  if (!Array.isArray(displaySuppliers)) {
    console.error("InventorySuppliers - suppliers is not an array:", displaySuppliers);
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
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

      <div className="relative w-full max-w-2xl mx-auto mb-8">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search suppliers by name..." 
          className="pl-10 h-12 text-lg bg-white"
        />
      </div>

      <SupplierList 
        suppliers={displaySuppliers} 
        isLoading={isLoading} 
      />
    </div>
  );
}