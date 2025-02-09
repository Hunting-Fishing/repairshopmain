
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useInventoryFormSubmit } from "../../hooks/useInventoryFormSubmit";
import { inventoryItemSchema, type InventoryFormSchema } from "./form-sections/validation";
import type { InventoryItem } from "../../types/base";
import { BasicInformationSection } from "./form-sections/BasicInformationSection";
import { ProductIdentificationSection } from "./form-sections/ProductIdentificationSection";
import { InventoryDetailsSection } from "./form-sections/InventoryDetailsSection";
import { PricingSection } from "./form-sections/PricingSection";
import { AdditionalInformationSection } from "./form-sections/AdditionalInformationSection";
import { FormHeader } from "./form-components/FormHeader";
import { FormActions } from "./form-components/FormActions";
import { FormTabsNav } from "./form-components/FormTabsNav";
import { useEffect } from "react";
import { toast } from "sonner";

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

  const { handleSubmit, isSubmitting, changes } = useInventoryFormSubmit({
    form,
    onSubmit,
    originalData: item,
  });

  const quantity = form.watch("quantity_in_stock");
  const reorderPoint = form.watch("reorder_point");

  useEffect(() => {
    if (quantity <= reorderPoint) {
      toast.warning("Low stock alert!", {
        description: "Current quantity is at or below reorder point.",
      });
    }
  }, [quantity, reorderPoint]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="h-full flex flex-col">
        <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg shadow-xl">
          <div className="p-6 space-y-6">
            <FormHeader 
              isEdit={!!item} 
              quantity={quantity} 
              reorderPoint={reorderPoint} 
            />

            <Separator className="my-6" />

            <ScrollArea className="h-[calc(100vh-280px)] pr-4">
              <Tabs defaultValue="basic" className="w-full">
                <FormTabsNav />

                <div className="space-y-6">
                  <TabsContent value="basic" className="mt-0 space-y-4 focus-visible:outline-none focus-visible:ring-0">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border p-6">
                      <BasicInformationSection form={form} />
                    </div>
                  </TabsContent>

                  <TabsContent value="identification" className="mt-0 space-y-4 focus-visible:outline-none focus-visible:ring-0">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border p-6">
                      <ProductIdentificationSection form={form} />
                    </div>
                  </TabsContent>

                  <TabsContent value="details" className="mt-0 space-y-4 focus-visible:outline-none focus-visible:ring-0">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border p-6">
                      <InventoryDetailsSection form={form} />
                    </div>
                  </TabsContent>

                  <TabsContent value="pricing" className="mt-0 space-y-4 focus-visible:outline-none focus-visible:ring-0">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border p-6">
                      <PricingSection form={form} />
                    </div>
                  </TabsContent>

                  <TabsContent value="additional" className="mt-0 space-y-4 focus-visible:outline-none focus-visible:ring-0">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border p-6">
                      <AdditionalInformationSection form={form} />
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </ScrollArea>
          </div>
        </div>
        
        <FormActions 
          isSubmitting={isSubmitting} 
          changes={changes} 
          onCancel={onCancel} 
        />
      </form>
    </Form>
  );
}
