import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { CustomerSearchCommand } from "@/components/search/CustomerSearchCommand";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

const workOrderSchema = z.object({
  customerId: z.string().min(1, "Customer selection is required"),
  vehicleInfo: z.string().min(1, "Vehicle information is required"),
  jobDescription: z.string().min(1, "Job description is required"),
});

type WorkOrderFormValues = z.infer<typeof workOrderSchema>;

interface WorkOrderFormProps {
  form: UseFormReturn<WorkOrderFormValues>;
  onCustomerSelect?: (customerId: string, vehicleInfo: string) => void;
}

export function WorkOrderForm({ form, onCustomerSelect }: WorkOrderFormProps) {
  const handleCustomerVehicleSelect = (customerId: string, vehicleInfo: string) => {
    form.setValue('customerId', customerId);
    form.setValue('vehicleInfo', vehicleInfo);
    onCustomerSelect?.(customerId, vehicleInfo);
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="customerId"
        render={() => (
          <FormItem>
            <FormLabel>Customer & Vehicle</FormLabel>
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
              <Textarea 
                {...field}
                readOnly
                placeholder="Vehicle information will appear here after selection"
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
                {...field}
                placeholder="Enter the job description..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}