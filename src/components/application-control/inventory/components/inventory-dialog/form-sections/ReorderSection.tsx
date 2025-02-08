
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import type { InventoryItemFormData } from "../../../types/base";

interface ReorderSectionProps {
  form: UseFormReturn<InventoryItemFormData>;
}

export function ReorderSection({ form }: ReorderSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="reorder_point"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reorder Point</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormDescription>
                Minimum quantity before reordering
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reorder_quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reorder Quantity</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormDescription>
                Quantity to order when reordering
              </FormDescription>
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Stock Keeping Unit
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="barcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Barcode</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Storage Location</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription>
              Where this item is stored
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
}
