
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../types/customerTypes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CustomerFormFieldsProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
}

export const CustomerFormFields = ({ form, isModernTheme = false }: CustomerFormFieldsProps) => {
  const inputClasses = isModernTheme
    ? "bg-white/80 border-orange-200/50 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white transition-all duration-200 rounded-lg"
    : "bg-white/80 border-[#FEC6A1]/30 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white transition-colors";

  const labelClasses = isModernTheme
    ? "text-gray-700 font-medium text-sm uppercase tracking-wide"
    : "text-gray-700 font-medium";

  const selectTriggerClasses = isModernTheme
    ? "bg-white/80 border-orange-200/50 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white transition-all duration-200 rounded-lg data-[placeholder]:text-gray-400"
    : "bg-white/80 border-[#FEC6A1]/30 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white transition-colors";

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="customer_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClasses}>Customer Type</FormLabel>
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
            <FormMessage className="text-[#F97316]" />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClasses}>First Name</FormLabel>
              <FormControl>
                <Input {...field} className={inputClasses} />
              </FormControl>
              <FormMessage className="text-[#F97316]" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClasses}>Last Name</FormLabel>
              <FormControl>
                <Input {...field} className={inputClasses} />
              </FormControl>
              <FormMessage className="text-[#F97316]" />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClasses}>Email</FormLabel>
            <FormControl>
              <Input type="email" {...field} className={inputClasses} />
            </FormControl>
            <FormMessage className="text-[#F97316]" />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="phone_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClasses}>Phone Number</FormLabel>
            <FormControl>
              <Input {...field} className={inputClasses} />
            </FormControl>
            <FormMessage className="text-[#F97316]" />
          </FormItem>
        )}
      />
    </div>
  );
};
