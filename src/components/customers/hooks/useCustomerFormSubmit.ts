import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { CustomerFormValues } from "../types/customerTypes";
import { customerValidationSchema, getRequiredFieldsForType } from "../schemas/customerValidationSchema";
import { supabase } from "@/integrations/supabase/client";

interface PendingChanges {
  values: CustomerFormValues;
  type: "create" | "update";
}

export function useCustomerFormSubmit({ 
  onSuccess, 
  initialData, 
  mode 
}: {
  onSuccess: () => void;
  initialData?: Partial<CustomerFormValues>;
  mode: "create" | "edit";
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [changeNotes, setChangeNotes] = useState("");
  const [pendingChanges, setPendingChanges] = useState<PendingChanges | null>(null);
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
      company_size: initialData?.company_size || "",
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
    console.log("Starting form submission with values:", values);
    setIsSubmitting(true);
    setFormErrors(null);

    try {
      const requiredFields = getRequiredFieldsForType(values.customer_type);
      const missingFields = requiredFields.filter(field => !values[field as keyof CustomerFormValues]);

      if (missingFields.length > 0) {
        toast({
          variant: "destructive",
          title: "Required Fields Missing",
          description: `Please fill in: ${missingFields.join(', ')}`
        });
        setIsSubmitting(false);
        return;
      }

      if (mode === "edit" && values.id) {
        const { data, error } = await supabase
          .from("customers")
          .update(values)
          .eq("id", values.id)
          .select();

        if (error) throw error;

        toast({
          title: "Customer Updated",
          description: "Customer information has been successfully updated."
        });
      } else {
        const { data, error } = await supabase
          .from("customers")
          .insert([values])
          .select();

        if (error) throw error;

        toast({
          title: "Customer Created",
          description: "New customer has been successfully created."
        });
      }

      onSuccess();
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
      setShowNotesDialog(false);
      setChangeNotes("");
      setPendingChanges(null);
    }
  };

  const handleFormSubmit = (values: CustomerFormValues) => {
    if (mode === "edit" && !changeNotes) {
      setPendingChanges({ values, type: "update" });
      setShowNotesDialog(true);
      return;
    }

    handleSubmit(values);
  };

  return {
    form,
    isSubmitting,
    formErrors,
    showNotesDialog,
    changeNotes,
    setChangeNotes,
    setShowNotesDialog,
    handleSubmit: handleFormSubmit,
    submitPendingChanges: () => {
      if (pendingChanges) {
        handleSubmit(pendingChanges.values);
      }
    }
  };
}
