
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import type { InventoryFormSchema } from "./validation";

interface PricingSectionProps {
  form: UseFormReturn<InventoryFormSchema>;
}

export function PricingSection({ form }: PricingSectionProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Pricing</h3>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="unit_cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit Cost</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="bg-white" 
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
              <FormLabel>Selling Price</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="bg-white" 
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </Card>
  );
}
