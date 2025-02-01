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
import { z } from "zod";

const workOrderSchema = z.object({
  customerId: z.string().min(1),
  vehicleInfo: z.string().min(1),
  jobDescription: z.string().min(1),
});

type WorkOrderFormValues = z.infer<typeof workOrderSchema>;

interface WorkOrderFormProps {
  form: UseFormReturn<WorkOrderFormValues>;
  onCustomerSelect?: (customerId: string, vehicleInfo: string) => void;
}

export function WorkOrderForm({ form, onCustomerSelect }: WorkOrderFormProps) {
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

  const handleCustomerVehicleSelect = (customerId: string, vehicleInfo: string) => {
    form.setValue("customerId", customerId);
    form.setValue("vehicleInfo", vehicleInfo);
    onCustomerSelect?.(customerId, vehicleInfo);
  };

  return (
    <>
      <FormField
        control={form.control}
        name="customerId"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Customer</FormLabel>
            <CustomerSearchCommand 
              onSelect={handleCustomerVehicleSelect}
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
              <Textarea {...field} />
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