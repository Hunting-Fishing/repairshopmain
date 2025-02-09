
import { PackageOpen, AlertCircle } from "lucide-react";

interface FormHeaderProps {
  isEdit: boolean;
  quantity: number;
  reorderPoint: number;
}

export function FormHeader({ isEdit, quantity, reorderPoint }: FormHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 backdrop-blur-lg shadow-xl">
          <PackageOpen className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            {isEdit ? 'Edit' : 'Add'} Inventory Item
          </h2>
          <p className="text-sm text-muted-foreground">
            Fill in the details below to {isEdit ? 'update' : 'create'} an inventory item
          </p>
        </div>
      </div>
      {quantity <= reorderPoint && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 shadow-lg shadow-yellow-500/5 animate-pulse">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Low Stock Alert</span>
        </div>
      )}
    </div>
  );
}
