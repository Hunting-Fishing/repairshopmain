import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCustomerFormSubmit } from "./hooks/useCustomerFormSubmit";
import { CustomerFormFields } from "./form/CustomerFormFields";
import { CustomerAddressFields } from "./form/CustomerAddressFields";
import { ChangeNotesDialog } from "./form/ChangeNotesDialog";
import { VinLookupSection } from "./form/VinLookupSection";
import { VehicleInfoSection } from "./form/VehicleInfoSection";
import { CustomerFormValues } from "./types/customerTypes";

export interface CustomerFormProps {
  onSuccess: () => void;
  initialData?: any;
  mode?: "create" | "edit";
}

export function CustomerForm({ onSuccess, initialData, mode = "create" }: CustomerFormProps) {
  const { handleSubmit, showNotesDialog, handleNotesSubmit, form } = useCustomerFormSubmit({
    onSuccess,
    initialData,
    mode,
  });

  const handleVehicleFound = (vehicleInfo: { make: string; model: string; year: string }) => {
    form.setValue("vehicle_make", vehicleInfo.make);
    form.setValue("vehicle_model", vehicleInfo.model);
    form.setValue("vehicle_year", vehicleInfo.year);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <CustomerFormFields form={form} />
          <CustomerAddressFields form={form} />
          <VinLookupSection onVehicleFound={handleVehicleFound} />
          <VehicleInfoSection form={form} />
          <Button type="submit" className="w-full">
            {mode === "create" ? "Add Customer" : "Update Customer"}
          </Button>
        </form>
      </Form>
      <ChangeNotesDialog {...showNotesDialog} onSubmit={handleNotesSubmit} />
    </>
  );
}