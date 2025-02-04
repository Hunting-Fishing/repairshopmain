import { Building2, Search, Plus, Filter, ArrowUpDown, Download, Upload } from "lucide-react";
import { useState } from "react";
import { AddSupplierDialog } from "./components/supplier/AddSupplierDialog";
import { SupplierList } from "./components/supplier/SupplierList";
import { useSuppliers } from "./hooks/useSuppliers";
import { useOrganizationData } from "@/hooks/staff/useOrganizationData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setFilterStatus(null)}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("active")}>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("inactive")}>
                  Inactive
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleSort("name")}>
                  Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("total_spent")}>
                  Total Spent
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("reliability_score")}>
                  Reliability Score
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <AddSupplierDialog />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <h3 className="font-medium text-muted-foreground">Active Suppliers</h3>
          <p className="text-2xl font-bold">{activeSuppliers}</p>
        </div>
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <h3 className="font-medium text-muted-foreground">Total Spent</h3>
          <p className="text-2xl font-bold">${totalSpent.toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <h3 className="font-medium text-muted-foreground">Average Score</h3>
          <p className="text-2xl font-bold">
            {(displaySuppliers.reduce((sum, s) => sum + (s.reliability_score || 0), 0) / displaySuppliers.length || 0).toFixed(1)}
          </p>
        </div>
      </div>

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