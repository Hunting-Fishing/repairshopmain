
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { FileText, Truck, Info, BookOpen } from "lucide-react";
import type { InventoryFormSchema } from "./validation";

interface AdditionalInformationSectionProps {
  form: UseFormReturn<InventoryFormSchema>;
}

export function AdditionalInformationSection({ form }: AdditionalInformationSectionProps) {
  return (
    <Card className="border border-border/40 bg-gradient-to-br from-card to-card/95 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          Additional Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="purchase_order_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Purchase Order Number
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter PO number" className="bg-background/50 transition-colors hover:bg-background/70 focus:bg-background" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="sales_order_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Sales Order Number
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter SO number" className="bg-background/50 transition-colors hover:bg-background/70 focus:bg-background" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="preferred_vendor"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                Preferred Vendor
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter preferred vendor" className="bg-background/50 transition-colors hover:bg-background/70 focus:bg-background" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="automotive_category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                Vehicle Type
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-background/50 transition-colors hover:bg-background/70 focus:bg-background">
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Other">General</SelectItem>
                  <SelectItem value="Engine">Engine</SelectItem>
                  <SelectItem value="Transmission">Transmission</SelectItem>
                  <SelectItem value="Brakes">Brakes</SelectItem>
                  <SelectItem value="Suspension">Suspension</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="HVAC">HVAC</SelectItem>
                  <SelectItem value="Body">Body</SelectItem>
                  <SelectItem value="Lighting">Lighting</SelectItem>
                  <SelectItem value="Filters">Filters</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                  <SelectItem value="Tools">Tools</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Notes
                </FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Enter any additional notes"
                    className="bg-background/50 transition-colors hover:bg-background/70 focus:bg-background resize-none min-h-[100px]" 
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="return_info"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Return Information
                </FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Enter return policy or information"
                    className="bg-background/50 transition-colors hover:bg-background/70 focus:bg-background resize-none min-h-[100px]" 
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
