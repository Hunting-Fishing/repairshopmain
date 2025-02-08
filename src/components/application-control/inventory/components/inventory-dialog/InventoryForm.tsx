
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInventoryFormSubmit } from "../../hooks/useInventoryFormSubmit";
import { InventoryReviewChanges } from "./InventoryReviewChanges";
import { BasicInfoSection } from "./form-sections/BasicInfoSection";
import { QuantitySection } from "./form-sections/QuantitySection";
import { ReorderSection } from "./form-sections/ReorderSection";
import { StatusSection } from "./form-sections/StatusSection";
import { inventoryItemSchema, type InventoryFormSchema } from "./form-sections/validation";
import type { InventoryItem } from "../../types/base";
import { ImageSection } from "./form-sections/ImageSection";

interface InventoryFormProps {
  item?: InventoryItem;
  onSubmit: (data: Partial<InventoryItem>) => void;
}

export function InventoryForm({ item, onSubmit }: InventoryFormProps) {
  const form = useForm<InventoryFormSchema>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      name: item?.name || "",
      description: item?.description || "",
      quantity_in_stock: item?.quantity_in_stock || 0,
      unit_cost: item?.unit_cost || 0,
      reorder_point: item?.reorder_point || 0,
      selling_price: item?.selling_price || 0,
      reorder_quantity: item?.reorder_quantity || 0,
      sku: item?.sku || "",
      status: item?.status || "active",
      location: item?.location || "",
      category_id: item?.category_id || "",
      supplier_id: item?.supplier_id || "",
      image_url: item?.image_url || "",
      barcode: item?.barcode || ""
    },
  });

  const { handleSubmit, isSubmitting, changes } = useInventoryFormSubmit({
    form,
    onSubmit,
    originalData: item,
  });

  // Watch for changes to calculate derived values
  const unitCost = form.watch("unit_cost");
  const sellingPrice = form.watch("selling_price");

  // Update selling price when unit cost changes
  useEffect(() => {
    const cost = Number(unitCost) || 0;
    if (cost > 0 && !sellingPrice) {
      // Default markup of 30% if no selling price is set
      form.setValue("selling_price", Number((cost * 1.3).toFixed(2)));
    }
  }, [unitCost, form, sellingPrice]);

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
            <ImageSection form={form} />
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
                  name="selling_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selling Price ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        />
                      </FormControl>
                      <FormDescription>
                        Suggested price will be 30% above unit cost if not specified
                      </FormDescription>
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
