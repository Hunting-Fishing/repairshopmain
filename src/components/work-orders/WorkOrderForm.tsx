import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { CustomerSearchCommand } from "../search/CustomerSearchCommand";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { UseFormReturn } from "react-hook-form";

interface WorkOrderFormProps {
  form: UseFormReturn<{
    customerId: string;
    vehicleInfo: string;
    jobDescription: string;
  }>;
}

export function WorkOrderForm({ form }: WorkOrderFormProps) {
  const { data: selectedCustomer } = useQuery({
    queryKey: ["customer", form.watch("customerId")],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", form.watch("customerId"))
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!form.watch("customerId"),
  });

  return (
    <>
      <FormField
        control={form.control}
        name="customerId"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Customer</FormLabel>
            <CustomerSearchCommand 
              onSelect={(id) => form.setValue("customerId", id)}
              className="border-input"
            />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="vehicleInfo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vehicle Information</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="2019 Toyota Camry" 
                {...field}
                value={selectedCustomer ? 
                  `${selectedCustomer.vehicle_year || ''} ${selectedCustomer.vehicle_make || ''} ${selectedCustomer.vehicle_model || ''}`.trim() : 
                  field.value
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="jobDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe the work to be done..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}