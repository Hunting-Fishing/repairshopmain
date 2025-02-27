
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
import { useState, useEffect, useCallback } from "react";

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

  // Improved query with better error handling
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
      
      // Clean up the data before returning it to ensure it matches the expected form structure
      if (data) {
        // Ensure numerical fields are properly typed
        const cleanedData = {
          ...data,
          loyalty_points: data.loyalty_points ? Number(data.loyalty_points) : undefined,
          lifetime_points: data.lifetime_points ? Number(data.lifetime_points) : undefined,
          total_spend: data.total_spend ? Number(data.total_spend) : undefined,
        };

        // Ensure array fields are properly initialized
        if (!cleanedData.address_book) cleanedData.address_book = [];
        if (!cleanedData.tags) cleanedData.tags = [];

        // Ensure nested objects are properly initialized
        if (!cleanedData.marketing_preferences) {
          cleanedData.marketing_preferences = { email: false, sms: false, phone: false };
        }
        
        if (!cleanedData.secondary_contact) {
          cleanedData.secondary_contact = {};
        }

        // Ensure customer_type is valid
        if (!cleanedData.customer_type || 
            !['Personal', 'Fleet', 'Business'].includes(cleanedData.customer_type)) {
          cleanedData.customer_type = 'Personal';
        }

        console.log("Cleaned customer data:", cleanedData);
        return cleanedData;
      }
      
      return data;
    },
    gcTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 5,
  });

  // Fix default values to ensure form is properly initialized
  const defaultValues: Partial<CustomerFormValues> = {
    first_name: "",
    last_name: "",
    email: "",
    customer_type: "Personal",
    marketing_preferences: { email: false, sms: false, phone: false },
    address_book: [],
    tags: [],
    secondary_contact: {},
  };

  // Set up form with proper validation and defaults
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerValidationSchema),
    defaultValues: customerData || defaultValues,
    mode: "onChange"
  });

  // Set form values when customer data is loaded
  useEffect(() => {
    if (customerData && !isLoading) {
      // Reset form with fetched data, properly handling potential type issues
      form.reset(customerData);
    }
  }, [customerData, isLoading, form]);

  // Add detailed logging for form changes
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name) {  // Only log changes to specific fields
        console.log("Form field changed:", { name, type, value: value[name as keyof typeof value] });
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Monitor form errors
  useEffect(() => {
    const errors = form.formState.errors;
    if (Object.keys(errors).length > 0) {
      console.log("Form validation errors:", errors);
      setFormErrors(errors);
    }
  }, [form.formState.errors]);

  const { isDirty, discardChanges } = useCustomerAutosave(form, customerId, mode === "edit");
  
  // Cancel handler with error handling
  const handleCancel = useCallback(() => {
    if (isDirty) {
      setShowUnsavedChanges(true);
    } else {
      // Just navigate back or reset
      form.reset();
    }
  }, [isDirty, form]);

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

      // Type safety: Ensure customer_type is valid
      if (!values.customer_type || !['Personal', 'Fleet', 'Business'].includes(values.customer_type)) {
        values.customer_type = 'Personal';
      }

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

      // Clean up values before submission
      const cleanedValues = { ...values };
      
      // Convert numeric string fields to numbers
      if (typeof cleanedValues.loyalty_points === 'string') {
        cleanedValues.loyalty_points = Number(cleanedValues.loyalty_points) || 0;
      }
      
      if (typeof cleanedValues.total_spend === 'string') {
        cleanedValues.total_spend = Number(cleanedValues.total_spend) || 0;
      }

      // Remove fields that don't apply to the current customer type
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

            <div className="flex justify-between mt-8">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                className="bg-gray-100 border-gray-300"
              >
                Cancel
              </Button>
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

// Add a Button component import that was missing
import { Button } from "@/components/ui/button";
