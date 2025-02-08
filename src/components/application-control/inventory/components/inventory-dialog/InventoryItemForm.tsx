
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
      vehicle_type: item?.vehicle_type ?? "general"
    },
  });

  const { handleSubmit, isSubmitting } = useInventoryFormSubmit({
    form,
    onSubmit,
    originalData: item,
  });

  const unitCost = form.watch("unit_cost");
  const sellingPrice = form.watch("selling_price");
  const [useManualPrice, setUseManualPrice] = useState(false);

  const markupPercentage = unitCost > 0 ? ((sellingPrice - unitCost) / unitCost) * 100 : 0;

  useEffect(() => {
    if (!useManualPrice && unitCost > 0) {
      const markup = 40;
      const calculatedPrice = unitCost * (1 + markup / 100);
      form.setValue("selling_price", Number(calculatedPrice.toFixed(2)));
    }
  }, [unitCost, form, useManualPrice]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 px-4 py-3 bg-[#F8FAFC]/80">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm">
          <FormField
            control={form.control}
            name="reorder_point"
            render={({ field }) => (
              <FormItem className="bg-white/90 p-3 rounded-md border border-gray-100">
                <FormLabel className="text-gray-700 font-medium">Reorder Level</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    className="bg-white border-gray-200 focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="space-y-4 bg-white/90 p-3 rounded-md border border-gray-100">
            <FormField
              control={form.control}
              name="unit_cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Cost Price</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      className="bg-white border-gray-200 focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                  <FormLabel className="text-gray-700 font-medium">Suggested Retail Price (MSRP)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      className="bg-white border-gray-200 focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled={!useManualPrice}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-full bg-white/90 p-3 rounded-md border border-gray-100">
            <div className="space-y-2">
              <FormLabel className="text-gray-700 font-medium">Markup Percentage ({markupPercentage.toFixed(0)}%)</FormLabel>
              <Slider 
                defaultValue={[40]}
                max={100}
                step={1}
                value={[markupPercentage]}
                className="py-4"
                onValueChange={(value) => {
                  if (!useManualPrice && unitCost > 0) {
                    const newPrice = unitCost * (1 + value[0] / 100);
                    form.setValue("selling_price", Number(newPrice.toFixed(2)));
                  }
                }}
                disabled={useManualPrice}
              />
            </div>

            <div className="flex items-center space-x-2 mt-2">
              <Switch
                checked={useManualPrice}
                onCheckedChange={setUseManualPrice}
              />
              <FormLabel className="text-gray-600 text-sm">Use Manual Price</FormLabel>
            </div>
          </div>

          <FormField
            control={form.control}
            name="vehicle_type"
            render={({ field }) => (
              <FormItem className="bg-white/90 p-3 rounded-md border border-gray-100">
                <FormLabel className="text-gray-700 font-medium">Vehicle Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white border-gray-200">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="automotive">Automotive</SelectItem>
                    <SelectItem value="motorcycle">Motorcycle</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-full bg-white/90 p-3 rounded-md border border-gray-100">
                <FormLabel className="text-gray-700 font-medium">Description</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    className="bg-white border-gray-200 focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] min-h-[100px]"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-200">
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
            className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white"
          >
            Save Item
          </Button>
        </div>
      </form>
    </Form>
  );
}
