import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { InventorySupplier } from "../../../../types";

const CURRENCIES = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "CNY", name: "Chinese Yuan" },
] as const;

interface FinancialInformationProps {
  supplier: InventorySupplier;
  isEditing: boolean;
  onInputChange: (field: keyof InventorySupplier, value: string | number) => void;
}

export function FinancialInformation({ supplier, isEditing, onInputChange }: FinancialInformationProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Financial Information</h3>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Credit Limit:</span>
          {isEditing ? (
            <Input
              type="number"
              value={supplier.credit_limit || 0}
              onChange={(e) => onInputChange('credit_limit', parseFloat(e.target.value))}
              className="w-32"
            />
          ) : (
            <span className="text-sm">${supplier.credit_limit?.toFixed(2) || '0.00'}</span>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total Spent:</span>
          <span className="text-sm">${supplier.total_spent?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Currency:</span>
          {isEditing ? (
            <Select
              value={supplier.currency || 'USD'}
              onValueChange={(value) => onInputChange('currency', value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span className="text-sm">{supplier.currency || 'USD'}</span>
          )}
        </div>
      </div>
    </div>
  );
}