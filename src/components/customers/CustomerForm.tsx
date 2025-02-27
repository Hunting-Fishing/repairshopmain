
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
import { validateCustomerBusinessRules } from "./rules/customerBusinessRules";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface CustomerFormProps {
  mode?: "create" | "edit";
  onSuccess: () => void;
  customerId: string;
}

export function CustomerForm({ mode = "create", onSuccess, customerId }: CustomerFormProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUnsavedChanges, setShowUnsavedChanges] = useState(false);
  const [formErrors, setFormErrors] = useState<any>(null);

  const { data: customerData, isLoading, error } = useQuery({
    queryKey: ["customer", customerId],
    queryFn: async () => {
      console.log("Fetching customer data for ID:", customerId);
      if (customerId === "new") return null;
      
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", customerId)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching customer data:", error);
        throw error;
      }
      
      console.log("Fetched customer data:", data);
      return data;
    },
    gcTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 5,
  });

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerValidationSchema),
    defaultValues: customerData || {
      first_name: "",
      last_name: "",
      email: "",
      customer_type: "Personal",
    },
    mode: "onChange"
  });

  // Add detailed logging for form changes
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      console.log("Form field changed:", { name, type, value });
      console.log("Current form values:", form.getValues());
      console.log("Form state:", form.formState);
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  useEffect(() => {
    const errors = form.formState.errors;
    if (Object.keys(errors).length > 0) {
      console.log("Form validation errors:", errors);
      setFormErrors(errors);
    }
  }, [form.formState.errors]);

  const { isDirty, discardChanges } = useCustomerAutosave(form, customerId, mode === "edit");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    console.error("Customer loading error:", error);
    return (
      <div className="p-4 text-red-500">
        Error loading customer: {error.message}
      </div>
    );
  }

  const onSubmit = async (values: CustomerFormValues) => {
    console.log("Form submission started with values:", values);
    try {
      setIsSubmitting(true);
      setFormErrors(null);

      console.log("Customer type:", values.customer_type);

      const { isValid, errors } = validateCustomerBusinessRules(values, values.customer_type);
      
      if (!isValid) {
        console.error("Business rule validation failed:", errors);
        errors.forEach(error => {
          toast({
            title: "Validation Error",
            description: error,
            variant: "destructive",
          });
        });
        setIsSubmitting(false);
        return;
      }

      const cleanedValues = { ...values };
      if (values.customer_type === "Personal") {
        console.log("Cleaning up Personal customer data...");
        delete cleanedValues.company_name;
        delete cleanedValues.business_classification_id;
        delete cleanedValues.tax_number;
        delete cleanedValues.fleet_details;
      }

      console.log("Cleaned form values:", cleanedValues);

      if (mode === "edit") {
        console.log("Updating customer with ID:", customerId);
        const { data, error } = await supabase
          .from("customers")
          .update(cleanedValues)
          .eq("id", customerId)
          .select();

        if (error) {
          console.error("Supabase update error:", error);
          throw error;
        }

        console.log("Update response:", data);
      } else {
        console.log("Creating new customer");
        const { data, error } = await supabase
          .from("customers")
          .insert([cleanedValues])
          .select();

        if (error) {
          console.error("Supabase insert error:", error);
          throw error;
        }

        console.log("Insert response:", data);
      }

      queryClient.invalidateQueries({ queryKey: ["customer", customerId] });
      onSuccess();
      
      toast({
        title: mode === "create" ? "Customer created" : "Customer updated",
        description: "Changes have been saved successfully.",
      });
    } catch (error: any) {
      console.error("Form submission error:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      
      toast({
        title: "Error",
        description: `${error.message}${error.hint ? `\nHint: ${error.hint}` : ''}`,
        variant: "destructive",
      });

      if (error.details) {
        setFormErrors({
          root: {
            type: "server",
            message: error.details
          }
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomerErrorBoundary>
      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {formErrors?.root && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {formErrors.root.message}
              </div>
            )}
            
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
                isSubmitting={isSubmitting}
              />
            </div>
          </form>
        </Form>
      </FormProvider>

      <AlertDialog open={showUnsavedChanges} onOpenChange={setShowUnsavedChanges}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowUnsavedChanges(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                discardChanges();
                setShowUnsavedChanges(false);
              }}
            >
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CustomerErrorBoundary>
  );
}
