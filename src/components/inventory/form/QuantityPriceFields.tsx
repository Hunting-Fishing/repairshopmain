import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { InventoryItemFormData } from "../types";

interface QuantityPriceFieldsProps {
  form: UseFormReturn<InventoryItemFormData>;
}

export function QuantityPriceFields({ form }: QuantityPriceFieldsProps) {
  return (
    <>
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
      <div className="flex gap-4">
        <FormField
          control={form.control}
          name="unit_cost"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Unit Cost</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="selling_price"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Selling Price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}