import { Building2 } from "lucide-react";

export function SupplierHeader() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Building2 className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold tracking-tight">Suppliers</h2>
      </div>
      <p className="text-muted-foreground mt-1">
        Browse and manage your inventory suppliers
      </p>
    </div>
  );
}