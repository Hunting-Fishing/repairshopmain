import { Building2, Search, Plus, Filter } from "lucide-react";
import { AddSupplierDialog } from "./components/supplier/AddSupplierDialog";
import { SupplierList } from "./components/supplier/SupplierList";
import { useSuppliers } from "./hooks/useSuppliers";
import { useOrganizationData } from "@/hooks/staff/useOrganizationData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">Suppliers</h2>
          </div>
          <p className="text-muted-foreground mt-1">
            Manage your inventory suppliers and their contact information
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <AddSupplierDialog />
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Search suppliers by name, location, or contact person..." 
          className="pl-10 h-10"
        />
      </div>

      <SupplierList 
        suppliers={displaySuppliers} 
        isLoading={isLoading} 
      />
    </div>
  );
}