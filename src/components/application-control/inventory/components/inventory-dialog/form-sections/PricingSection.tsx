
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { useState, useEffect } from "react";
import type { InventoryFormSchema } from "./validation";
import { ManualPriceToggle } from "./pricing/ManualPriceToggle";
import { PriceFields } from "./pricing/PriceFields";
import { MarkupField } from "./pricing/MarkupField";
import { PriceSummary } from "./pricing/PriceSummary";

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
        <ManualPriceToggle 
          useManualPrice={useManualPrice} 
          onToggle={setUseManualPrice} 
        />
        <PriceFields 
          form={form} 
          useManualPrice={useManualPrice} 
        />
        <MarkupField 
          form={form} 
          useManualPrice={useManualPrice} 
        />
        <PriceSummary 
          unitCost={unitCost} 
          markupPercentage={markupPercentage} 
        />
      </CardContent>
    </Card>
  );
}
