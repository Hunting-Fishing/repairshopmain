
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { cn } from "@/lib/utils";

interface CustomerTypeSelectProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
}

export function CustomerTypeSelect({ form, isModernTheme = false }: CustomerTypeSelectProps) {
  const selectTriggerClasses = isModernTheme
    ? "bg-white/80 border-orange-200/50 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white transition-all duration-200 rounded-lg data-[placeholder]:text-gray-400"
    : "bg-white/80 border-[#FEC6A1]/30 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white transition-colors";

  const labelClasses = cn(
    isModernTheme
      ? "text-gray-700 font-medium text-sm uppercase tracking-wide"
      : "text-gray-700 font-medium"
  );

  return (
    <FormField
      control={form.control}
      name="customer_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel className={labelClasses}>
            <span className="flex items-center gap-1">
              Customer Type
              <span className="text-red-500">*</span>
            </span>
          </FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className={selectTriggerClasses}>
                <SelectValue placeholder="Select customer type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className={isModernTheme ? "bg-white/95 backdrop-blur-lg border-orange-200/50" : ""}>
              <SelectItem value="Personal">Personal</SelectItem>
              <SelectItem value="Fleet">Fleet</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage className="text-red-500 text-sm font-medium" />
        </FormItem>
      )}
    />
  );
}
