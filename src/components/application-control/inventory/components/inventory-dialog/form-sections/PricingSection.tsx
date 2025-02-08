
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { UseFormReturn } from "react-hook-form";
import { useEffect } from "react";
import type { InventoryFormSchema } from "./validation";

interface PricingSectionProps {
  form: UseFormReturn<InventoryFormSchema>;
}

export function PricingSection({ form }: PricingSectionProps) {
  const unitCost = form.watch("unit_cost");
  const markupPercentage = form.watch("markup_percentage") ?? 0;

  // Update selling price when unit cost or markup changes
  useEffect(() => {
    const markup = (unitCost * markupPercentage) / 100;
    const newSellingPrice = unitCost + markup;
    form.setValue("selling_price", Number(newSellingPrice.toFixed(2)));
  }, [unitCost, markupPercentage, form]);

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

        <div className="col-span-2 space-y-4">
          <FormField
            control={form.control}
            name="markup_percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Markup Percentage</FormLabel>
                <div className="space-y-4">
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => {
                        const value = Math.min(1000, Math.max(0, Number(e.target.value)));
                        field.onChange(value);
                      }}
                      className="bg-white w-32"
                      placeholder="Enter markup %"
                    />
                  </FormControl>
                  <Slider
                    value={[field.value || 0]}
                    onValueChange={(values) => field.onChange(values[0])}
                    max={1000}
                    step={1}
                    className="w-full"
                  />
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
    </Card>
  );
}
