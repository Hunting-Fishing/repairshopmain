
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { useState, useEffect } from "react";
import type { InventoryFormSchema } from "./validation";

interface PricingSectionProps {
  form: UseFormReturn<InventoryFormSchema>;
}

export function PricingSection({ form }: PricingSectionProps) {
  const unitCost = form.watch("unit_cost") || 0;
  const markupPercentage = form.watch("markup_percentage") || 0;
  const [useManualPrice, setUseManualPrice] = useState(false);

  useEffect(() => {
    if (!useManualPrice) {
      const markup = (unitCost * markupPercentage) / 100;
      const newSellingPrice = unitCost + markup;
      form.setValue("selling_price", Number(newSellingPrice.toFixed(2)));
    }
  }, [unitCost, markupPercentage, form, useManualPrice]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Cost/Pricing</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm">Manual Price</span>
          <Switch
            checked={useManualPrice}
            onCheckedChange={setUseManualPrice}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
                  className="h-12 text-lg"
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
              <FormLabel className="text-base">Retail Price</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="h-12 text-lg font-medium"
                  disabled={!useManualPrice}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="markup_percentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Markup %</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="h-12 text-lg"
                  disabled={useManualPrice}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex flex-col justify-end">
          <div className="text-sm text-gray-600">
            Calculated Price: ${((unitCost * (1 + markupPercentage / 100))).toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">
            Markup Amount: ${((unitCost * markupPercentage / 100)).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
