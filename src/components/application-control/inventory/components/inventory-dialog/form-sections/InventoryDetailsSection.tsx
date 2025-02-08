
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { Package2, Scale, Timer, Box } from "lucide-react";
import type { InventoryFormSchema } from "./validation";

interface InventoryDetailsSectionProps {
  form: UseFormReturn<InventoryFormSchema>;
}

export function InventoryDetailsSection({ form }: InventoryDetailsSectionProps) {
  return (
    <Card className="border border-border/40 bg-gradient-to-br from-card to-card/95 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package2 className="h-5 w-5 text-primary" />
          Inventory Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="quantity_in_stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Box className="h-4 w-4 text-muted-foreground" />
                  Quantity in Stock
                </FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="bg-background/50 transition-colors hover:bg-background/70 focus:bg-background" 
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
                <FormLabel className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-muted-foreground" />
                  Unit of Measure
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-background/50 transition-colors hover:bg-background/70 focus:bg-background">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Each">Each</SelectItem>
                    <SelectItem value="Box">Box</SelectItem>
                    <SelectItem value="Pound">Pound</SelectItem>
                    <SelectItem value="Gallon">Gallon</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="reorder_point"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Box className="h-4 w-4 text-muted-foreground" />
                  Reorder Point
                </FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="bg-background/50 transition-colors hover:bg-background/70 focus:bg-background" 
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
                <FormLabel className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-muted-foreground" />
                  Lead Time (days)
                </FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="bg-background/50 transition-colors hover:bg-background/70 focus:bg-background" 
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
