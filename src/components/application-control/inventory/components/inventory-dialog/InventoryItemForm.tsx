
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
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
  onCancel: () => void;
}

export function InventoryForm({ item, onSubmit, onCancel }: InventoryFormProps) {
  const form = useForm<InventoryFormSchema>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      name: item?.name ?? "",
      description: item?.description ?? "",
      quantity_in_stock: item?.quantity_in_stock ?? 0,
      unit_cost: item?.unit_cost ?? 0,
      reorder_point: item?.reorder_point ?? 0,
      selling_price: item?.selling_price ?? 0,
      reorder_quantity: item?.reorder_quantity ?? 0,
      sku: item?.sku ?? "",
      status: item?.status ?? "active",
      location: item?.location ?? "",
      category_id: item?.category_id ?? "",
      supplier_id: item?.supplier_id ?? "",
      image_url: item?.image_url ?? "",
      barcode: item?.barcode ?? ""
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
      form.setValue("selling_price", Number((cost * 1.3).toFixed(2)));
    }
  }, [unitCost, form, sellingPrice]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="additional">Additional</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <BasicInfoSection form={form} />
                <ImageSection form={form} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
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
                      <FormDescription className="flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Suggested price will be 30% above unit cost if not specified
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {sellingPrice > 0 && unitCost > 0 && (
              <Alert>
                <AlertDescription>
                  Profit Margin: {((sellingPrice - unitCost) / unitCost * 100).toFixed(1)}%
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <QuantitySection form={form} />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <ReorderSection form={form} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="additional" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <StatusSection form={form} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {changes && <InventoryReviewChanges changes={changes} />}

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : (item ? "Update" : "Create")} Item
          </Button>
        </div>
      </form>
    </Form>
  );
}
