
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useInventoryFormSubmit } from "../../hooks/useInventoryFormSubmit";
import { inventoryItemSchema, type InventoryFormSchema } from "./form-sections/validation";
import type { InventoryItem } from "../../types/base";

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
      upc_ean: item?.upc_ean ?? ""
    },
  });

  const { handleSubmit, isSubmitting } = useInventoryFormSubmit({
    form,
    onSubmit,
    originalData: item,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="h-full bg-[#F0F0F0]">
        <div className="h-full flex flex-col">
          <div className="flex-1 p-6">
            <Tabs defaultValue="basic" className="h-full">
              <TabsList className="mb-4 bg-white border border-gray-200">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="details">Additional Details</TabsTrigger>
              </TabsList>
              
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="pr-4">
                  <TabsContent value="basic" className="m-0">
                    <Card className="p-6">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Item Name</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-white" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="sku"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SKU</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-white" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="upc_ean"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>UPC/EAN</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-white" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea {...field} className="bg-white resize-none h-32" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="inventory" className="m-0">
                    <Card className="p-6">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="quantity_in_stock"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantity on Hand</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  className="bg-white" 
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="unit_of_measure"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit of Measure</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select unit" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="each">Each</SelectItem>
                                  <SelectItem value="box">Box</SelectItem>
                                  <SelectItem value="pound">Pound</SelectItem>
                                  <SelectItem value="gallon">Gallon</SelectItem>
                                </SelectContent>
                              </Select>
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
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  className="bg-white" 
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="lead_time_days"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Lead Time (days)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  className="bg-white" 
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="pricing" className="m-0">
                    <Card className="p-6">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="unit_cost"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit Cost</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.01"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  className="bg-white" 
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="selling_price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Selling Price</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.01"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  className="bg-white" 
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="details" className="m-0">
                    <Card className="p-6">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Weight</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.01"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  className="bg-white" 
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="dimensions"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dimensions</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-white" placeholder="L x W x H" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="purchase_order_number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Purchase Order Number</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-white" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="sales_order_number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sales Order Number</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-white" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="return_info"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Return Information</FormLabel>
                              <FormControl>
                                <Textarea {...field} className="bg-white resize-none h-20" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Notes</FormLabel>
                              <FormControl>
                                <Textarea {...field} className="bg-white resize-none h-20" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </Card>
                  </TabsContent>
                </div>
              </ScrollArea>
            </Tabs>
          </div>
          
          <div className="border-t border-gray-200 bg-gray-50 p-4 flex justify-end space-x-4">
            <Button 
              variant="outline" 
              type="button" 
              onClick={onCancel}
              className="bg-white hover:bg-gray-50"
            >
              Cancel
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
