import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import type { InventorySupplier } from "../../../../types";

interface AdditionalInformationProps {
  supplier: InventorySupplier;
  isEditing: boolean;
  onInputChange: (field: keyof InventorySupplier, value: string) => void;
}

export function AdditionalInformation({ supplier, isEditing, onInputChange }: AdditionalInformationProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Additional Information</h3>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Reliability Score:</span>
          <span className="text-sm">{supplier.reliability_score?.toFixed(1) || 'N/A'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Fulfillment Rate:</span>
          <span className="text-sm">{supplier.fulfillment_rate?.toFixed(1)}%</span>
        </div>
        {supplier.last_order_date && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Last Order:</span>
            <span className="text-sm">{formatDate(supplier.last_order_date)}</span>
          </div>
        )}
      </div>
      {supplier.notes && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Notes</h3>
          {isEditing ? (
            <Input
              value={supplier.notes || ''}
              onChange={(e) => onInputChange('notes', e.target.value)}
              placeholder="Add notes"
            />
          ) : (
            <p className="text-sm text-muted-foreground">{supplier.notes}</p>
          )}
        </div>
      )}
    </div>
  );
}