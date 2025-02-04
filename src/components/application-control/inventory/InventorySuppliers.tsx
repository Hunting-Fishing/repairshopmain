import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SupplierList } from "./components/supplier/SupplierList";
import { SupplierHeader } from "./components/supplier/supplier-list/SupplierHeader";
import { SupplierActions } from "./components/supplier/supplier-list/SupplierActions";
import { SupplierMetrics } from "./components/supplier/supplier-list/SupplierMetrics";
import { useSuppliers } from "./hooks/useSuppliers";
import { useOrganizationData } from "@/hooks/staff/useOrganizationData";
import type { InventorySupplier } from "./types";

interface InventorySuppliersProps {
  suppliers?: InventorySupplier[];
}

export function InventorySuppliers({ suppliers = [] }: InventorySuppliersProps) {
  const { userProfile } = useOrganizationData();
  const { suppliers: hookSuppliers, isLoading, error } = useSuppliers(userProfile?.organization_id);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof InventorySupplier>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  const displaySuppliers = hookSuppliers || suppliers;

  if (!Array.isArray(displaySuppliers)) {
    console.error("InventorySuppliers - suppliers is not an array:", displaySuppliers);
    return null;
  }

  const filteredSuppliers = displaySuppliers
    .filter(supplier => {
      const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.contact_person?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (filterStatus && supplier.status !== filterStatus) {
        return false;
      }
      
      return matchesSearch;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const direction = sortDirection === "asc" ? 1 : -1;
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction * aValue.localeCompare(bValue);
      }
      return 0;
    });

  const handleSort = (field: keyof InventorySupplier) => {
    if (field === sortField) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const activeSuppliers = displaySuppliers.filter(s => s.status === "active").length;
  const totalSpent = displaySuppliers.reduce((sum, s) => sum + (s.total_spent || 0), 0);
  const averageScore = displaySuppliers.reduce((sum, s) => sum + (s.reliability_score || 0), 0) / displaySuppliers.length || 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      <div className="flex justify-between items-center">
        <SupplierHeader />
        <SupplierActions 
          onFilterChange={setFilterStatus}
          onSortChange={handleSort}
        />
      </div>

      <SupplierMetrics 
        activeSuppliers={activeSuppliers}
        totalSpent={totalSpent}
        averageScore={averageScore}
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Search suppliers by name, contact person, or email..." 
          className="pl-10 h-12 text-lg bg-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{filteredSuppliers.length}</span> of {displaySuppliers.length} suppliers
        </div>
        <div className="flex gap-2">
          {filterStatus && (
            <Badge variant="outline" className="bg-primary/5">
              Status: {filterStatus}
            </Badge>
          )}
          <Badge variant="outline" className="bg-primary/5">
            Sort: {sortField} ({sortDirection})
          </Badge>
        </div>
      </div>

      <SupplierList 
        suppliers={filteredSuppliers} 
        isLoading={isLoading} 
      />
    </div>
  );
}