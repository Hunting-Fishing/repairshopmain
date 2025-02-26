
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

  const customerTypes = [
    { value: "Personal", icon: User },
    { value: "Fleet", icon: UsersRound },
    { value: "Business", icon: Users }
  ];

  return (
    <FormField
      control={form.control}
      name="customer_type"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel className={labelClasses}>
            <span className="flex items-center gap-1">
              Customer Type
              <span className="text-red-500">*</span>
            </span>
          </FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className={cn(selectTriggerClasses, "w-full")}>
                <SelectValue placeholder="Select customer type">
                  {field.value && (
                    <div className="flex items-center">
                      {(() => {
                        const type = customerTypes.find(t => t.value === field.value);
                        if (type) {
                          const Icon = type.icon;
                          return (
                            <>
                              <Icon className="h-4 w-4 mr-2" />
                              <span>{field.value}</span>
                            </>
                          );
                        }
                        return field.value;
                      })()}
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent 
              className={cn(
                "bg-white/95 backdrop-blur-lg w-full min-w-[200px]",
                isModernTheme ? "border-orange-200/50" : ""
              )}
            >
              {customerTypes.map(({ value, icon: Icon }) => (
                <SelectItem 
                  key={value} 
                  value={value} 
                  className="flex items-center py-3 cursor-pointer"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  <span>{value}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage className="text-red-500 text-sm font-medium" />
        </FormItem>
      )}
    />
  );
}
