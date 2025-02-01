import { Package, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { InventoryItemDialog } from "@/components/inventory/InventoryItemDialog";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { InventoryList } from "@/components/inventory/InventoryList";

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    lowStock: false,
    outOfStock: false,
    needsReorder: false,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Package className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
            <p className="text-muted-foreground">
              Manage your inventory, track stock levels, and handle suppliers
            </p>
          </div>
        </div>
        <InventoryItemDialog />
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inventory..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <InventoryFilters onFilterChange={setFilters} />
      </div>

      <InventoryList searchQuery={searchQuery} filters={filters} />
    </div>
  );
}