
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../types/customerTypes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormInput } from "./fields/FormInput";

interface CustomerFormFieldsProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
}

export const CustomerFormFields = ({ form, isModernTheme = false }: CustomerFormFieldsProps) => {
  const selectTriggerClasses = isModernTheme
    ? "bg-white/80 border-orange-200/50 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white transition-all duration-200 rounded-lg data-[placeholder]:text-gray-400"
    : "bg-white/80 border-[#FEC6A1]/30 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white transition-colors";

  const labelClasses = isModernTheme
    ? "text-gray-700 font-medium text-sm uppercase tracking-wide"
    : "text-gray-700 font-medium";

  const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
    <span className="flex items-center gap-1">
      {children}
      <span className="text-red-500">*</span>
    </span>
  );

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="customer_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClasses}>
              <RequiredLabel>Customer Type</RequiredLabel>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          form={form}
          name="first_name"
          label="First Name"
          placeholder="Enter first name"
          isModernTheme={isModernTheme}
          required={true}
        />
        <FormInput
          form={form}
          name="last_name"
          label="Last Name"
          placeholder="Enter last name"
          isModernTheme={isModernTheme}
          required={true}
        />
      </div>
      
      <FormInput
        form={form}
        name="email"
        label="Email"
        type="email"
        placeholder="Enter email address"
        isModernTheme={isModernTheme}
        required={true}
      />
      
      <FormInput
        form={form}
        name="phone_number"
        label="Phone Number"
        placeholder="Enter phone number"
        isModernTheme={isModernTheme}
      />
    </div>
  );
};
