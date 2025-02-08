
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInventoryFormSubmit } from "../../hooks/useInventoryFormSubmit";
import { InventoryReviewChanges } from "./InventoryReviewChanges";
import { BasicInfoSection } from "./form-sections/BasicInfoSection";
import { QuantitySection } from "./form-sections/QuantitySection";
import { ReorderSection } from "./form-sections/ReorderSection";
import { StatusSection } from "./form-sections/StatusSection";
import { inventoryItemSchema } from "./form-sections/validation";
import type { InventoryItem } from "../../types/base";

interface InventoryFormProps {
  item?: InventoryItem;
  onSubmit: (data: Partial<InventoryItem>) => void;
}

export function InventoryForm({ item, onSubmit }: InventoryFormProps) {
  const form = useForm({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      name: item?.name || "",
      description: item?.description || "",
      quantity_in_stock: item?.quantity_in_stock || 0,
      unit_cost: item?.unit_cost || 0,
      reorder_point: item?.reorder_point || 0,
      markup_percentage: item?.markup_percentage || 0,
      retail_price: item?.retail_price || 0,
      sku: item?.sku || "",
      status: item?.status || "active",
      location: item?.location || "",
      category_id: item?.category_id || "",
      supplier_id: item?.supplier_id || ""
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
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="additional">Additional</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <BasicInfoSection form={form} />
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6">
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
                      <FormMessage />
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
                      <FormMessage />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4 mt-4">
            <QuantitySection form={form} />
            <ReorderSection form={form} />
          </TabsContent>

          <TabsContent value="additional" className="space-y-4 mt-4">
            <StatusSection form={form} />
          </TabsContent>
        </Tabs>

        {changes && <InventoryReviewChanges changes={changes} />}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
