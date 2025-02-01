import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryOverview } from "./InventoryOverview";
import { InventoryCategories } from "./InventoryCategories";
import { InventorySuppliers } from "./InventorySuppliers";

export function InventoryTab() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <InventoryOverview />
      <InventoryCategories />
      <InventorySuppliers />
    </div>
  );
}