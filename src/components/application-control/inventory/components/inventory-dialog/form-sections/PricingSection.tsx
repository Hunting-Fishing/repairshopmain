
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
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
  const unitCost = form.watch("unit_cost") || 0;
  const markupPercentage = form.watch("markup_percentage") || 0;

  // Update selling price when unit cost or markup changes
  useEffect(() => {
    const markup = (unitCost * markupPercentage) / 100;
    const newSellingPrice = unitCost + markup;
    form.setValue("selling_price", Number(newSellingPrice.toFixed(2)));
  }, [unitCost, markupPercentage, form]);

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Pricing Information</h3>
        <p className="text-sm text-gray-500 mb-4">Set your product's cost, markup, and final selling price</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="unit_cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Unit Cost</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="bg-white text-lg" 
                  placeholder="0.00"
                />
              </FormControl>
              <FormDescription>
                Cost per unit before markup
              </FormDescription>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="selling_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Selling Price</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="bg-white text-lg font-medium" 
                  placeholder="0.00"
                />
              </FormControl>
              <FormDescription>
                Final price after markup
              </FormDescription>
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4 pt-2">
        <FormField
          control={form.control}
          name="markup_percentage"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between mb-2">
                <FormLabel className="text-base">Markup Percentage</FormLabel>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => {
                      const value = Math.min(1000, Math.max(0, Number(e.target.value)));
                      field.onChange(value);
                    }}
                    className="bg-white w-24 text-right"
                    placeholder="0"
                  />
                  <span className="text-sm font-medium">%</span>
                </div>
              </div>
              <FormControl>
                <Slider
                  value={[field.value || 0]}
                  onValueChange={(values) => field.onChange(values[0])}
                  max={1000}
                  step={1}
                  className="py-4"
                />
              </FormControl>
              <FormDescription className="text-center pt-2">
                Drag the slider or enter a value to adjust markup (0-1000%)
              </FormDescription>
            </FormItem>
          )}
        />

        <div className="bg-blue-50 p-4 rounded-lg mt-4">
          <div className="text-sm text-blue-700">
            Current Markup: ${((unitCost * markupPercentage) / 100).toFixed(2)}
          </div>
        </div>
      </div>
    </Card>
  );
}
