
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../types/customerTypes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface BusinessFormFieldsProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
}

export const BusinessFormFields = ({ form, isModernTheme = false }: BusinessFormFieldsProps) => {
  const inputClasses = isModernTheme
    ? "bg-white/80 border-orange-200/50 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white transition-all duration-200 rounded-lg"
    : "bg-white/80 border-[#FEC6A1]/30 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white transition-colors";

  const labelClasses = isModernTheme
    ? "text-gray-700 font-medium text-sm uppercase tracking-wide"
    : "text-gray-700 font-medium";

  const { data: classifications } = useQuery({
    queryKey: ['business-classifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_classifications')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const companySizes = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501+ employees"
  ];

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="business_classification_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClasses}>Business Classification</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className={inputClasses}>
                  <SelectValue placeholder="Select business classification" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {classifications?.map((classification) => (
                  <SelectItem key={classification.id} value={classification.id}>
                    {classification.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="company_size"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClasses}>Company Size</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className={inputClasses}>
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {companySizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
