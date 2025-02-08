
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useInventoryFormSubmit } from "../../hooks/useInventoryFormSubmit";
import { inventoryItemSchema, type InventoryFormSchema } from "./form-sections/validation";
import type { InventoryItem } from "../../types/base";
import { BasicInformationSection } from "./form-sections/BasicInformationSection";
import { ProductIdentificationSection } from "./form-sections/ProductIdentificationSection";
import { InventoryDetailsSection } from "./form-sections/InventoryDetailsSection";
import { PricingSection } from "./form-sections/PricingSection";
import { AdditionalInformationSection } from "./form-sections/AdditionalInformationSection";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

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
      status: item?.status ?? "active",
      sku: item?.sku ?? "",
      barcode: item?.barcode ?? "",
      automotive_category: item?.automotive_category ?? "Other",
      unit_of_measure: item?.unit_of_measure ?? "Each",
      lead_time_days: item?.lead_time_days ?? 0,
      weight: item?.weight ?? 0,
      dimensions: item?.dimensions ?? "",
      date_received: item?.date_received ?? "",
      purchase_order_number: item?.purchase_order_number ?? "",
      sales_order_number: item?.sales_order_number ?? "",
      return_info: item?.return_info ?? "",
      notes: item?.notes ?? "",
      preferred_vendor: item?.preferred_vendor ?? "",
      upc_ean: item?.upc_ean ?? "",
      markup_percentage: item?.markup_percentage ?? 40,
    },
  });

  const { handleSubmit, isSubmitting } = useInventoryFormSubmit({
    form,
    onSubmit,
    originalData: item,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="h-full flex flex-col">
        <ScrollArea className="flex-1">
          <div className="space-y-8 p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {item ? 'Edit' : 'Add'} Inventory Item
                </h2>
                <p className="text-sm text-muted-foreground">
                  Fill in the details below to {item ? 'update' : 'create'} an inventory item.
                </p>
              </div>

              <Separator className="my-6" />

              <div className="space-y-8">
                <BasicInformationSection form={form} />
                <ProductIdentificationSection form={form} />
                <InventoryDetailsSection form={form} />
                <PricingSection form={form} />
                <AdditionalInformationSection form={form} />
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <div className="border-t border-border/50 bg-muted/50 p-4 flex justify-end space-x-4">
          <Button 
            variant="outline" 
            type="button" 
            onClick={onCancel}
            className="min-w-[100px]"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="min-w-[100px] bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Item'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
