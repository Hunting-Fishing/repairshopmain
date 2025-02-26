
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { CustomerFormValues } from "../types/customerTypes";
import { customerValidationSchema } from "../schemas/customerValidationSchema";
import { supabase } from "@/integrations/supabase/client";

interface UseCustomerFormSubmitProps {
  onSuccess: () => void;
  initialData?: Partial<CustomerFormValues>;
  mode: "create" | "edit";
}

export function useCustomerFormSubmit({ 
  onSuccess, 
  initialData,
  mode 
}: UseCustomerFormSubmitProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<any>(null);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerValidationSchema),
    defaultValues: {
      first_name: initialData?.first_name || "",
      last_name: initialData?.last_name || "",
      email: initialData?.email || "",
      phone_number: initialData?.phone_number || "",
      customer_type: initialData?.customer_type || "Personal",
      language_preference: initialData?.language_preference || "en",
      company_name: initialData?.company_name || "",
      business_classification_id: initialData?.business_classification_id || "",
      tax_number: initialData?.tax_number || "",
      marketing_preferences: initialData?.marketing_preferences || {
        email: false,
        sms: false,
        phone: false
      },
      ...initialData
    },
    mode: "onChange"
  });

  const handleSubmit = async (values: CustomerFormValues) => {
    setIsSubmitting(true);
    setFormErrors(null);

    try {
      if (mode === "edit" && values.id) {
        const { error } = await supabase
          .from("customers")
          .update(values)
          .eq("id", values.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("customers")
          .insert([values]);

        if (error) throw error;
      }

      onSuccess();
      toast({
        title: mode === "create" ? "Customer Created" : "Customer Updated",
        description: "Customer information has been successfully saved."
      });
    } catch (error: any) {
      console.error("Form submission error:", error);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred while saving the customer."
      });

      setFormErrors({
        root: {
          type: "server",
          message: error.message
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    formErrors,
    handleSubmit: form.handleSubmit(handleSubmit)
  };
}
