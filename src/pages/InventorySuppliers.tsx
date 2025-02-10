
import { InventorySuppliers as InventorySuppliersComponent } from "@/components/application-control/inventory/InventorySuppliers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InventorySuppliers() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Inventory Suppliers</CardTitle>
        </CardHeader>
        <CardContent>
          <InventorySuppliersComponent />
        </CardContent>
      </Card>
    </div>
  );
}
