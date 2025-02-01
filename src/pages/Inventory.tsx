import { Package } from "lucide-react";

export default function Inventory() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Package className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">
            Manage your inventory, track stock levels, and handle suppliers
          </p>
        </div>
      </div>
      
      <div className="grid gap-4">
        {/* We'll implement the full inventory management UI in the next iteration */}
        <p>Inventory management interface coming soon...</p>
      </div>
    </div>
  );
}