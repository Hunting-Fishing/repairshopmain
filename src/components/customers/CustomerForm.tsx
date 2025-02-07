
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCustomerFormSubmit } from "./hooks/useCustomerFormSubmit";
import { CustomerFormFields } from "./form/CustomerFormFields";
import { CustomerAddressFields } from "./form/CustomerAddressFields";
import { ChangeNotesDialog } from "./form/ChangeNotesDialog";
import { VehicleInfoSection } from "./form/VehicleInfoSection";
import { CustomerFormValues } from "./types/customerTypes";
import { Separator } from "@/components/ui/separator";

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

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                <div className="bg-white/80 rounded-lg p-6 shadow-sm border border-gray-100">
                  <CustomerFormFields form={form} />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Vehicle Information</h3>
                <div className="bg-white/80 rounded-lg p-6 shadow-sm border border-gray-100">
                  <VehicleInfoSection form={form} />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Address Information</h3>
              <div className="bg-white/80 rounded-lg p-6 shadow-sm border border-gray-100">
                <CustomerAddressFields form={form} />
              </div>
            </div>
          </div>

          <Separator className="my-6" />
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="w-full md:w-auto bg-[#F97316] hover:bg-[#EA580C] text-white px-8"
            >
              {mode === "create" ? "Add Customer" : "Update Customer"}
            </Button>
          </div>
        </form>
      </Form>
      <ChangeNotesDialog {...showNotesDialog} onSubmit={handleNotesSubmit} />
    </>
  );
}
