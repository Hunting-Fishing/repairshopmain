
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { cn } from "@/lib/utils";
import { User, Users, UsersRound } from "lucide-react";

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

  const getCustomerTypeIcon = (type: string) => {
    switch (type) {
      case "Personal":
        return <User className="h-4 w-4 mr-2" />;
      case "Fleet":
        return <UsersRound className="h-4 w-4 mr-2" />;
      case "Business":
        return <Users className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

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
                <SelectValue placeholder="Select customer type">
                  {field.value && (
                    <div className="flex items-center">
                      {getCustomerTypeIcon(field.value)}
                      <span>{field.value}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent className={cn(
              "bg-white/95 backdrop-blur-lg",
              isModernTheme ? "border-orange-200/50" : ""
            )}>
              <SelectItem value="Personal" className="flex items-center py-3">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>Personal</span>
                </div>
              </SelectItem>
              <SelectItem value="Fleet" className="flex items-center py-3">
                <div className="flex items-center">
                  <UsersRound className="h-4 w-4 mr-2" />
                  <span>Fleet</span>
                </div>
              </SelectItem>
              <SelectItem value="Business" className="flex items-center py-3">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Business</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <FormMessage className="text-red-500 text-sm font-medium" />
        </FormItem>
      )}
    />
  );
}
