import { Package, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { InventoryList } from "@/components/application-control/inventory/InventoryList";
import { InventoryFilters } from "@/components/application-control/inventory/InventoryFilters";
import { InventoryOverview } from "@/components/application-control/inventory/InventoryOverview";
import { InventoryCategories } from "@/components/application-control/inventory/InventoryCategories";
import { InventorySuppliers } from "@/components/application-control/inventory/InventorySuppliers";
import { useInventoryData } from "@/components/application-control/inventory/hooks/useInventoryData";

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    lowStock: false,
    outOfStock: false,
    needsReorder: false,
  });

  const { categories, suppliers } = useInventoryData();

  const handleFilterChange = (newFilters: {
    lowStock?: boolean;
    outOfStock?: boolean;
    needsReorder?: boolean;
  }) => {
    setFilters({
      lowStock: newFilters.lowStock ?? false,
      outOfStock: newFilters.outOfStock ?? false,
      needsReorder: newFilters.needsReorder ?? false,
    });
  };

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
      </div>

      <InventoryOverview />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <InventoryCategories categories={categories || []} />
        <InventorySuppliers suppliers={suppliers || []} />
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
        <InventoryFilters onFilterChange={handleFilterChange} />
      </div>

      <InventoryList searchQuery={searchQuery} filters={filters} />
    </div>
  );
}