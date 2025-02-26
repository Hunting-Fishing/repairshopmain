
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../types/customerTypes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

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

  const { data: classifications, isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

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
        name="tax_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClasses}>Tax Number</FormLabel>
            <FormControl>
              <Input 
                {...field}
                className={inputClasses}
                placeholder="Enter tax number"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
