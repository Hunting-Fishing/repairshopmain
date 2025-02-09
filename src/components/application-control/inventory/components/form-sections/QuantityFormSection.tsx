
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import type { InventoryFormSchema } from "../inventory-dialog/form-sections/validation";

interface QuantityFormSectionProps {
  form: UseFormReturn<InventoryFormSchema>;
}

export function QuantityFormSection({ form }: QuantityFormSectionProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="quantity_in_stock"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quantity in Stock</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="reorder_point"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Reorder Point</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
