
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import type { InventoryFormSchema } from "../validation";

interface PriceFieldsProps {
  form: UseFormReturn<InventoryFormSchema>;
  useManualPrice: boolean;
}

export function PriceFields({ form, useManualPrice }: PriceFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="unit_cost"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              Unit Cost
            </FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                className="bg-background/50 transition-colors hover:bg-background/70 focus:bg-background h-12 text-lg" 
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="selling_price"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              Retail Price
            </FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                className="bg-background/50 transition-colors hover:bg-background/70 focus:bg-background h-12 text-lg font-medium"
                disabled={!useManualPrice}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
