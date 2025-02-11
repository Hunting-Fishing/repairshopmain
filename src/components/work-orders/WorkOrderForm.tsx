
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { CustomerSelectionSection } from "./components/CustomerSelectionSection";
import { VehicleSelectionSection } from "./components/VehicleSelectionSection";
import { JobTemplateSection } from "./components/JobTemplateSection";

const workOrderSchema = z.object({
  customerId: z.string().min(1, "Customer selection is required"),
  vehicleInfo: z.string().min(1, "Vehicle information is required"),
  jobDescription: z.string().min(1, "Job description is required"),
  jobTemplate: z.string().optional(),
});

type WorkOrderFormValues = z.infer<typeof workOrderSchema>;

interface WorkOrderFormProps {
  form: UseFormReturn<WorkOrderFormValues>;
  onCustomerSelect?: (customerId: string, vehicleInfo: string) => void;
}

export function WorkOrderForm({ form, onCustomerSelect }: WorkOrderFormProps) {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomerId(customerId);
    form.setValue('customerId', customerId);
  };

  const handleVehicleSelect = (vehicleInfo: string) => {
    if (selectedCustomerId && onCustomerSelect) {
      onCustomerSelect(selectedCustomerId, vehicleInfo);
    }
  };

  return (
    <div className="space-y-6">
      <CustomerSelectionSection 
        form={form}
        onCustomerSelect={handleCustomerSelect}
      />

      <VehicleSelectionSection 
        form={form}
        customerId={selectedCustomerId}
        onVehicleSelect={handleVehicleSelect}
      />

      <JobTemplateSection form={form} />
    </div>
  );
}
