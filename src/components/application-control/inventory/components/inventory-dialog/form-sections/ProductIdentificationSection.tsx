
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import type { InventoryFormSchema } from "./validation";

interface ProductIdentificationSectionProps {
  form: UseFormReturn<InventoryFormSchema>;
}

export function ProductIdentificationSection({ form }: ProductIdentificationSectionProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Product Identification</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
            name="barcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Barcode</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-white" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

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
      </div>
    </Card>
  );
}
