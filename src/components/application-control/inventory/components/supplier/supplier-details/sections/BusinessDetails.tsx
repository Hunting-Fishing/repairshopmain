import { Building, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { InventorySupplier } from "../../../../types";

interface BusinessDetailsProps {
  supplier: InventorySupplier;
  isEditing: boolean;
  onInputChange: (field: keyof InventorySupplier, value: string) => void;
}

export function BusinessDetails({ supplier, isEditing, onInputChange }: BusinessDetailsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Business Details</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          {isEditing ? (
            <Input
              value={supplier.tax_id || ''}
              onChange={(e) => onInputChange('tax_id', e.target.value)}
              placeholder="Tax ID"
            />
          ) : (
            <span className="text-sm">Tax ID: {supplier.tax_id}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          {isEditing ? (
            <Input
              value={supplier.payment_method || ''}
              onChange={(e) => onInputChange('payment_method', e.target.value)}
              placeholder="Payment method"
            />
          ) : (
            <span className="text-sm">Payment Method: {supplier.payment_method}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={supplier.status === 'active' ? "default" : "destructive"}>
            {supplier.status}
          </Badge>
        </div>
      </div>
    </div>
  );
}