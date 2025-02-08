
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { Barcode, QrCode, ScanLine } from "lucide-react";
import type { InventoryFormSchema } from "./validation";

interface ProductIdentificationSectionProps {
  form: UseFormReturn<InventoryFormSchema>;
}

export function ProductIdentificationSection({ form }: ProductIdentificationSectionProps) {
  return (
    <Card className="border border-border/40 bg-gradient-to-br from-card to-card/95 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ScanLine className="h-5 w-5 text-primary" />
          Product Identification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <QrCode className="h-4 w-4 text-muted-foreground" />
                  SKU
                </FormLabel>
                <FormControl>
                  <Input {...field} className="bg-background/50 transition-colors hover:bg-background/70 focus:bg-background" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="barcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Barcode className="h-4 w-4 text-muted-foreground" />
                  Barcode
                </FormLabel>
                <FormControl>
                  <Input {...field} className="bg-background/50 transition-colors hover:bg-background/70 focus:bg-background" />
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
              <FormLabel className="flex items-center gap-2">
                <ScanLine className="h-4 w-4 text-muted-foreground" />
                UPC/EAN
              </FormLabel>
              <FormControl>
                <Input {...field} className="bg-background/50 transition-colors hover:bg-background/70 focus:bg-background" />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
