
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CustomerSearchCommand } from "@/components/search/CustomerSearchCommand";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

const workOrderSchema = z.object({
  customerId: z.string().min(1, "Customer selection is required"),
  vehicleInfo: z.string().min(1, "Vehicle information is required"),
  jobDescription: z.string().min(1, "Job description is required"),
  jobTemplate: z.string().optional(),
});

type WorkOrderFormValues = z.infer<typeof workOrderSchema>;

interface CustomerSelectionSectionProps {
  form: UseFormReturn<WorkOrderFormValues>;
  onCustomerSelect: (customerId: string) => void;
}

export function CustomerSelectionSection({ form, onCustomerSelect }: CustomerSelectionSectionProps) {
  return (
    <FormField
      control={form.control}
      name="customerId"
      render={() => (
        <FormItem>
          <FormLabel>Customer</FormLabel>
          <FormControl>
            <CustomerSearchCommand 
              onSelect={onCustomerSelect}
              className="border-input"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
