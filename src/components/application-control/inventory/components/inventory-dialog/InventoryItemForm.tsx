
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useInventoryFormSubmit } from "../../hooks/useInventoryFormSubmit";
import { inventoryItemSchema, type InventoryFormSchema } from "./form-sections/validation";
import type { InventoryItem } from "../../types/base";
import { BasicInformationSection } from "./form-sections/BasicInformationSection";
import { PricingSection } from "./form-sections/PricingSection";
import { ProductIdentificationSection } from "./form-sections/ProductIdentificationSection";
import { PhysicalAttributesSection } from "./form-sections/PhysicalAttributesSection";
import { AdditionalInformationSection } from "./form-sections/AdditionalInformationSection";

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
      vehicle_type: item?.vehicle_type ?? "general",
      unit_of_measure: item?.unit_of_measure ?? "",
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="h-full">
        <div className="h-full flex flex-col">
          <ScrollArea className="flex-1">
            <div className="max-w-4xl mx-auto p-6 space-y-6">
              <div className="grid gap-6">
                <BasicInformationSection form={form} />
                <PricingSection form={form} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProductIdentificationSection form={form} />
                  <PhysicalAttributesSection form={form} />
                </div>
                <AdditionalInformationSection form={form} />
              </div>
            </div>
          </ScrollArea>
          
          <div className="border-t border-gray-200 bg-gray-50 p-4 flex justify-end space-x-4">
            <Button 
              variant="outline" 
              type="button" 
              onClick={onCancel}
              className="bg-white hover:bg-gray-50"
            >
              Reset
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Item
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
