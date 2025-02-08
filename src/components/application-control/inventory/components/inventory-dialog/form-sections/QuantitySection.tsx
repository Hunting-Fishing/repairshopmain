
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import type { InventoryItemFormData } from "../../../types";

interface QuantitySectionProps {
  form: UseFormReturn<InventoryItemFormData>;
}

export function QuantitySection({ form }: QuantitySectionProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="quantity_in_stock"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quantity in Stock</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="unit_cost"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Unit Cost</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
