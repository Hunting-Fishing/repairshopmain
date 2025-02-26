
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
import { validateCustomerBusinessRules, handleCustomerDataChanges } from "./rules/customerBusinessRules";
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
import { useState } from "react";

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

  const { data: customerData, isLoading, error } = useQuery({
    queryKey: ["customer", customerId],
    queryFn: async () => {
      if (customerId === "new") return null;
      
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", customerId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    gcTime: 1000 * 60 * 60, // Cache for 1 hour
    staleTime: 1000 * 60 * 5, // Consider data stale after 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
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
  const { isDirty, discardChanges } = useCustomerAutosave(form, customerId, mode === "edit");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading customer: {error.message}
      </div>
    );
  }

  const onSubmit = async (values: CustomerFormValues) => {
    try {
      setIsSubmitting(true);

      // Validate business rules
      const { isValid, errors } = validateCustomerBusinessRules(values, values.customer_type);
      
      if (!isValid) {
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

      if (mode === "edit") {
        // Get existing data for change detection
        const { data: existingData } = await supabase
          .from("customers")
          .select("*")
          .eq("id", customerId)
          .single();

        // Handle lifecycle and workflow triggers
        await handleCustomerDataChanges(existingData, values);

        const { error } = await supabase
          .from("customers")
          .update(values)
          .eq("id", customerId);

        if (error) throw error;
      } else {
        // Handle lifecycle and workflow triggers for new customer
        await handleCustomerDataChanges(null, values);

        const { error } = await supabase
          .from("customers")
          .insert([values]);

        if (error) throw error;
      }

      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["customer", customerId] });
      onSuccess();
      
      toast({
        title: mode === "create" ? "Customer created" : "Customer updated",
        description: "Changes have been saved successfully.",
      });
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWindowClose = (e: BeforeUnloadEvent) => {
    if (isDirty()) {
      e.preventDefault();
      e.returnValue = '';
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
