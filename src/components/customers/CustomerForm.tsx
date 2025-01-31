import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCustomerFormSubmit } from "./hooks/useCustomerFormSubmit";
import { CustomerFormFields } from "./form/CustomerFormFields";
import { CustomerAddressFields } from "./form/CustomerAddressFields";
import { ChangeNotesDialog } from "./form/ChangeNotesDialog";
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

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <CustomerFormFields form={form} />
          <CustomerAddressFields form={form} />
          <Button type="submit" className="w-full">
            {mode === "create" ? "Add Customer" : "Update Customer"}
          </Button>
        </form>
      </Form>
      <ChangeNotesDialog {...showNotesDialog} onSubmit={handleNotesSubmit} />
    </>
  );
}