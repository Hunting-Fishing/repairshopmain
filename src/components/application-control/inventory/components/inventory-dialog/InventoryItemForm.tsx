import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInventoryFormSubmit } from "../../hooks/useInventoryFormSubmit";
import { inventoryItemSchema, type InventoryFormSchema } from "./form-sections/validation";
import type { InventoryItem } from "../../types/base";
import { BasicInformationSection } from "./form-sections/BasicInformationSection";
import { ProductIdentificationSection } from "./form-sections/ProductIdentificationSection";
import { InventoryDetailsSection } from "./form-sections/InventoryDetailsSection";
import { PricingSection } from "./form-sections/PricingSection";
import { AdditionalInformationSection } from "./form-sections/AdditionalInformationSection";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, X, PackageOpen, ScanLine, Microscope, DollarSign, Info } from "lucide-react";

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
        <div className="p-6 space-y-6 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm">
                <PackageOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                  {item ? 'Edit' : 'Add'} Inventory Item
                </h2>
                <p className="text-sm text-muted-foreground">
                  Fill in the details below to {item ? 'update' : 'create'} an inventory item.
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <ScrollArea className="h-[calc(100vh-280px)]">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="w-full justify-start mb-6 bg-background/50 p-1.5 backdrop-blur-sm rounded-lg border border-border/40">
                <TabsTrigger value="basic" className="flex items-center gap-2 data-[state=active]:bg-primary/10">
                  <PackageOpen className="h-4 w-4" />
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="identification" className="flex items-center gap-2 data-[state=active]:bg-primary/10">
                  <ScanLine className="h-4 w-4" />
                  Identification
                </TabsTrigger>
                <TabsTrigger value="details" className="flex items-center gap-2 data-[state=active]:bg-primary/10">
                  <Microscope className="h-4 w-4" />
                  Details
                </TabsTrigger>
                <TabsTrigger value="pricing" className="flex items-center gap-2 data-[state=active]:bg-primary/10">
                  <DollarSign className="h-4 w-4" />
                  Pricing
                </TabsTrigger>
                <TabsTrigger value="additional" className="flex items-center gap-2 data-[state=active]:bg-primary/10">
                  <Info className="h-4 w-4" />
                  Additional
                </TabsTrigger>
              </TabsList>

              <div className="space-y-6 px-1">
                <TabsContent value="basic" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <BasicInformationSection form={form} />
                </TabsContent>

                <TabsContent value="identification" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <ProductIdentificationSection form={form} />
                </TabsContent>

                <TabsContent value="details" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <InventoryDetailsSection form={form} />
                </TabsContent>

                <TabsContent value="pricing" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <PricingSection form={form} />
                </TabsContent>

                <TabsContent value="additional" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <AdditionalInformationSection form={form} />
                </TabsContent>
              </div>
            </Tabs>
          </ScrollArea>
        </div>
        
        <div className="border-t bg-gradient-to-b from-background/50 to-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 flex justify-end space-x-4">
          <Button 
            variant="outline" 
            type="button" 
            onClick={onCancel}
            className="min-w-[100px] border-border/40 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="min-w-[100px] bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Item
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
