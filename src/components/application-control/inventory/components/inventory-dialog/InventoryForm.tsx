
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useInventoryFormSubmit } from "./useInventoryFormSubmit";
import { InventoryReviewChanges } from "./InventoryReviewChanges";
import type { InventoryItem } from "../../types";
import { useEffect } from "react";

interface InventoryFormProps {
  item?: InventoryItem;
  onSubmit: (data: Partial<InventoryItem>) => void;
}

export function InventoryForm({ item, onSubmit }: InventoryFormProps) {
  const form = useForm({
    defaultValues: {
      name: item?.name || "",
      description: item?.description || "",
      quantity_in_stock: item?.quantity_in_stock || 0,
      unit_cost: item?.unit_cost || 0,
      reorder_point: item?.reorder_point || 0,
      markup_percentage: item?.markup_percentage || 0,
      retail_price: item?.retail_price || 0,
    },
  });

  const { handleSubmit, isSubmitting, changes } = useInventoryFormSubmit({
    form,
    onSubmit,
    originalData: item,
  });

  // Watch for changes to calculate derived values
  const unitCost = form.watch("unit_cost");
  const markupPercentage = form.watch("markup_percentage");
  const retailPrice = form.watch("retail_price");

  // Update retail price when unit cost or markup changes
  useEffect(() => {
    const cost = Number(unitCost) || 0;
    const markup = Number(markupPercentage) || 0;
    const calculatedRetail = cost * (1 + markup / 100);
    
    if (!retailPrice || Math.abs(calculatedRetail - retailPrice) > 0.01) {
      form.setValue("retail_price", Number(calculatedRetail.toFixed(2)));
    }
  }, [unitCost, markupPercentage]);

  // Update markup percentage when retail price changes manually
  useEffect(() => {
    const cost = Number(unitCost) || 0;
    const retail = Number(retailPrice) || 0;
    
    if (cost > 0 && retail > 0) {
      const calculatedMarkup = ((retail / cost) - 1) * 100;
      if (Math.abs(calculatedMarkup - markupPercentage) > 0.01) {
        form.setValue("markup_percentage", Number(calculatedMarkup.toFixed(2)));
      }
    }
  }, [retailPrice]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity_in_stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity in Stock</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unit_cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit Cost ($)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
              <FormLabel>Markup Percentage (%)</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <Slider
                    value={[field.value]}
                    onValueChange={([value]) => field.onChange(value)}
                    max={200}
                    step={0.1}
                  />
                  <Input
                    type="number"
                    step="0.1"
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Adjust the markup percentage using the slider or enter a value
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="retail_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Retail Price ($)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
            </FormItem>
          )}
        />

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
            </FormItem>
          )}
        />

        {changes && <InventoryReviewChanges changes={changes} />}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
