import { Building2, Search, Plus, Filter, ArrowUpDown } from "lucide-react";
import { AddSupplierDialog } from "./components/supplier/AddSupplierDialog";
import { SupplierList } from "./components/supplier/SupplierList";
import { useSuppliers } from "./hooks/useSuppliers";
import { useOrganizationData } from "@/hooks/staff/useOrganizationData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { InventorySupplier } from "./types";

interface InventorySuppliersProps {
  suppliers: InventorySupplier[];
}

export function InventorySuppliers({ suppliers }: InventorySuppliersProps) {
  const { userProfile } = useOrganizationData();
  const { suppliers: hookSuppliers, isLoading, error } = useSuppliers(userProfile?.organization_id);
  
  const displaySuppliers = hookSuppliers || suppliers;

  if (!Array.isArray(displaySuppliers)) {
    console.error("InventorySuppliers - suppliers is not an array:", displaySuppliers);
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">Suppliers</h2>
          </div>
          <p className="text-muted-foreground mt-1">
            Browse and manage your inventory suppliers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Sort
          </Button>
          <AddSupplierDialog />
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Search suppliers by name, location, or product categories..." 
          className="pl-10 h-12 text-lg bg-white"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Viewing <span className="font-medium">{displaySuppliers.length}</span> suppliers
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">Featured</Badge>
          <Badge variant="outline" className="bg-blue-50">New</Badge>
        </div>
      </div>

      <SupplierList 
        suppliers={displaySuppliers} 
        isLoading={isLoading} 
      />
    </div>
  );
}