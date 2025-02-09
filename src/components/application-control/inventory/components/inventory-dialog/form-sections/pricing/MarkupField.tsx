
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Percent } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import type { InventoryFormSchema } from "../validation";

interface MarkupFieldProps {
  form: UseFormReturn<InventoryFormSchema>;
  useManualPrice: boolean;
}

export function MarkupField({ form, useManualPrice }: MarkupFieldProps) {
  return (
    <FormField
      control={form.control}
      name="markup_percentage"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Percent className="h-4 w-4 text-muted-foreground" />
            Markup %
          </FormLabel>
          <FormControl>
            <Input 
              type="number"
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
              className="bg-background/50 transition-colors hover:bg-background/70 focus:bg-background h-12 text-lg"
              disabled={useManualPrice}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
