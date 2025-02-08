
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { useEffect, useState } from "react";
import type { InventoryFormSchema } from "./validation";

interface PricingSectionProps {
  form: UseFormReturn<InventoryFormSchema>;
}

export function PricingSection({ form }: PricingSectionProps) {
  const unitCost = form.watch("unit_cost") || 0;
  const markupPercentage = form.watch("markup_percentage") || 0;
  const [useManualPrice, setUseManualPrice] = useState(false);

  // Update selling price when unit cost or markup changes
  useEffect(() => {
    if (!useManualPrice) {
      const markup = (unitCost * markupPercentage) / 100;
      const newSellingPrice = unitCost + markup;
      form.setValue("selling_price", Number(newSellingPrice.toFixed(2)));
    }
  }, [unitCost, markupPercentage, form, useManualPrice]);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="unit_cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Cost Price</FormLabel>
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
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="selling_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Suggested Retail Price (MSRP)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="bg-white text-lg font-medium"
                    placeholder="0.00"
                    disabled={!useManualPrice}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel className="text-base">Markup Percentage ({markupPercentage}%)</FormLabel>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Use Manual Price</span>
              <Switch
                checked={useManualPrice}
                onCheckedChange={setUseManualPrice}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="markup_percentage"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="space-y-4">
                    <Slider
                      value={[field.value || 0]}
                      onValueChange={(values) => field.onChange(values[0])}
                      max={1000}
                      step={1}
                      disabled={useManualPrice}
                      className="py-4"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>0%</span>
                      <span>1000%</span>
                    </div>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg">
            <div>
              <div className="text-sm text-blue-700 font-medium">Calculated Price</div>
              <div className="text-lg">${((unitCost * (1 + markupPercentage / 100))).toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-blue-700 font-medium">Price Difference from MSRP</div>
              <div className="text-lg">
                ${(((unitCost * (1 + markupPercentage / 100)) - form.getValues("selling_price")) || 0).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
