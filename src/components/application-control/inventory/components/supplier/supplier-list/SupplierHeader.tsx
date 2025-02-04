import { AddSupplierDialog } from "../AddSupplierDialog";

interface SupplierHeaderProps {
  totalSuppliers: number;
}

export function SupplierHeader({ totalSuppliers }: SupplierHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-semibold">Suppliers</h1>
        <p className="text-muted-foreground">
          {totalSuppliers === 0 
            ? "No suppliers found. Add your first supplier to get started."
            : `Managing ${totalSuppliers} supplier${totalSuppliers === 1 ? '' : 's'}`
          }
        </p>
      </div>
      <AddSupplierDialog />
    </div>
  );
}