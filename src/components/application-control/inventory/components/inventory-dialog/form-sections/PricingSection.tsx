
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { useState, useEffect } from "react";
import { DollarSign, Percent, Calculator } from "lucide-react";
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
    <Card className="border border-border/40 bg-gradient-to-br from-card to-card/95 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Cost/Pricing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Manual Price</span>
          <Switch
            checked={useManualPrice}
            onCheckedChange={setUseManualPrice}
          />
        </div>

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

        <FormField
          control={form.control}
          name="markup_percentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-muted-foreground" />
                Markup %
              </FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="bg-background/50 transition-colors hover:bg-background/70 focus:bg-background h-12 text-lg"
                  disabled={useManualPrice}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-2 p-4 rounded-lg bg-background/50">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Calculated Price:</span>
            <span className="font-medium">${((unitCost * (1 + markupPercentage / 100))).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Markup Amount:</span>
            <span className="font-medium">${((unitCost * markupPercentage / 100)).toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
