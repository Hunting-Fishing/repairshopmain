
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useInventoryFormSubmit } from "../../hooks/useInventoryFormSubmit";
import { inventoryItemSchema, type InventoryFormSchema } from "./form-sections/validation";
import type { InventoryItem } from "../../types/base";
import { Card } from "@/components/ui/card";
import { PricingSection } from "./form-sections/PricingSection";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="h-full">
        <div className="h-full flex flex-col">
          <ScrollArea className="flex-1">
            <div className="max-w-7xl mx-auto p-6">
              <Card className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Basic Information</h3>
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Part Number/SKU</FormLabel>
                            <FormControl>
                              <Input {...field} className="h-12 text-lg" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Part Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} className="min-h-[100px] text-lg" />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="preferred_vendor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Vendor</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 text-lg">
                                  <SelectValue placeholder="Select vendor" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="american_automotive">AMERICAN AUTOMOTIVE</SelectItem>
                                <SelectItem value="other_vendor">Other Vendor</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Vehicle Application</h3>
                      <FormField
                        control={form.control}
                        name="automotive_category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Category</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 text-lg">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Other">General</SelectItem>
                                <SelectItem value="Engine">Engine</SelectItem>
                                <SelectItem value="Transmission">Transmission</SelectItem>
                                <SelectItem value="Brakes">Brakes</SelectItem>
                                <SelectItem value="Suspension">Suspension</SelectItem>
                                <SelectItem value="Electrical">Electrical</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <PricingSection form={form} />
                    
                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Stock/Ordering</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="quantity_in_stock"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base"># in Stock</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field} 
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  className="h-12 text-lg" 
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
                              <FormLabel className="text-base">Min. Level</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field} 
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  className="h-12 text-lg" 
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-8">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Comments</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="min-h-[120px] text-lg" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </Card>
            </div>
          </ScrollArea>
          
          <div className="border-t border-gray-200 bg-gray-50 p-4 flex justify-end space-x-4">
            <Button 
              variant="outline" 
              type="button" 
              onClick={onCancel}
              className="h-11 px-6 text-base"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="h-11 px-6 text-base bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Item
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
