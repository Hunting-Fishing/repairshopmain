import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { CustomerSearchCommand } from "@/components/search/CustomerSearchCommand";
import { Vehicle } from "@/components/customers/vehicles/types";
import type { UseFormReturn } from "react-hook-form";

interface WorkOrderFormProps {
  form: UseFormReturn<{
    customerId: string;
    vehicleInfo: string;
    jobDescription: string;
  }>;
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