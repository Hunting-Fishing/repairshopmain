
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { CustomerFormFields } from "./form/CustomerFormFields";
import { CustomerAddressFields } from "./form/CustomerAddressFields";
import { AddressBookSection } from "./form/sections/AddressBookSection";
import { FormSection } from "./form/FormSection";
import { SubmitButton } from "./form/fields/SubmitButton";
import { useForm, FormProvider } from "react-hook-form";
import { CustomerFormValues } from "./types/customerTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerValidationSchema } from "./schemas/customerValidationSchema";
import { useCustomerAutosave } from "./hooks/useCustomerAutosave";
import { CustomerErrorBoundary } from "./error-boundary/CustomerErrorBoundary";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CustomerFormProps {
  mode?: "create" | "edit";
  onSuccess: () => void;
  customerId: string;
}

export function CustomerForm({ mode = "create", onSuccess, customerId }: CustomerFormProps) {
  const queryClient = useQueryClient();

  const { data: customerData, isLoading } = useQuery({
    queryKey: ["customer", customerId],
    queryFn: async () => {
      if (customerId === "new") return null;
      
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", customerId)
        .single();
      
      if (error) throw error;
      return data;
    },
    gcTime: 1000 * 60 * 60, // Cache for 1 hour
    staleTime: 1000 * 60 * 5, // Consider data stale after 5 minutes
  });

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerValidationSchema),
    defaultValues: customerData || {
      first_name: "",
      last_name: "",
      email: "",
      customer_type: "Personal",
    },
  });

  // Enable autosave only in edit mode
  useCustomerAutosave(form, customerId, mode === "edit");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const onSubmit = async (values: CustomerFormValues) => {
    try {
      if (mode === "edit") {
        const { error } = await supabase
          .from("customers")
          .update(values)
          .eq("id", customerId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("customers")
          .insert([values]);

        if (error) throw error;
      }

      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["customer", customerId] });
      onSuccess();
    } catch (error: any) {
      console.error("Form submission error:", error);
      // Error will be handled by the form's error handling
      throw error;
    }
  };

  return (
    <CustomerErrorBoundary>
      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormSection title="Personal Information">
                <CustomerFormFields form={form} customerId={customerId} />
              </FormSection>

              <FormSection title="Address Information">
                <CustomerAddressFields form={form} />
              </FormSection>
            </div>

            <Separator className="my-8" />
            
            <AddressBookSection form={form} />

            <div className="flex justify-end mt-8">
              <SubmitButton 
                label={mode === "create" ? "Add Customer" : "Update Customer"} 
              />
            </div>
          </form>
        </Form>
      </FormProvider>
    </CustomerErrorBoundary>
  );
}
