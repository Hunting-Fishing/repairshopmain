
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CustomerFormValues } from "../types/customerTypes";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerValidationSchema } from "../schemas/customerValidationSchema";
import { logError } from "@/utils/error-handling";

interface ChangeRecord {
  old: any;
  new: any;
}

interface PendingChanges {
  values: CustomerFormValues;
  changes: Record<string, ChangeRecord>;
  userId: string;
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

  // Initialize form with react-hook-form
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerValidationSchema),
    defaultValues: {
      first_name: initialData?.first_name || "",
      last_name: initialData?.last_name || "",
      email: initialData?.email || "",
      phone_number: initialData?.phone_number || "",
      customer_type: initialData?.customer_type || "Personal",
      language_preference: initialData?.language_preference || "en",
      marketing_preferences: initialData?.marketing_preferences || {
        email: false,
        sms: false,
        phone: false
      },
      ...initialData // Spread remaining initial values
    }
  });

  const handleSubmit = async (values: CustomerFormValues) => {
    console.log("Starting form submission with values:", values);
    setIsSubmitting(true);
    setFormErrors(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user.id) {
        throw new Error("User session not found");
      }

      // For edit mode
      if (mode === "edit" && initialData?.id) {
        console.log("Processing edit mode submission");
        
        // Compare changes
        const changes: Record<string, ChangeRecord> = {};
        Object.keys(values).forEach((key) => {
          const typedKey = key as keyof CustomerFormValues;
          if (values[typedKey] !== initialData[typedKey]) {
            changes[key] = {
              old: initialData[typedKey],
              new: values[typedKey],
            };
          }
        });

        if (Object.keys(changes).length > 0) {
          console.log("Found changes:", changes);
          
          // Update the customer record
          const { error: updateError } = await supabase
            .from('customers')
            .update(values)
            .eq('id', initialData.id);

          if (updateError) {
            throw updateError;
          }

          // Log the changes
          await supabase.from('customer_history').insert({
            customer_id: initialData.id,
            change_type: 'UPDATE',
            changed_by: session.user.id,
            changes: changes,
            notes: changeNotes
          });
        }
      } else {
        // Create mode
        console.log("Processing create mode submission");
        const { error: insertError } = await supabase
          .from('customers')
          .insert([values]);
        
        if (insertError) throw insertError;
      }

      toast({
        title: `Customer ${mode === "create" ? "created" : "updated"} successfully`,
        description: "The changes have been saved.",
      });

      onSuccess();
    } catch (error: any) {
      console.error("Form submission error:", error);
      
      logError(error, {
        action_type: mode === "create" ? "customer_creation" : "customer_update",
        table_name: "customers",
        level: "error",
        metadata: {
          formValues: values,
          customerId: initialData?.id
        }
      });

      setFormErrors({
        type: "server",
        message: error.message
      });

      toast({
        variant: "destructive",
        title: `Error ${mode === "create" ? "creating" : "updating"} customer`,
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
    isSubmitting,
    formErrors,
    showNotesDialog: {
      open: showNotesDialog,
      onOpenChange: setShowNotesDialog,
      notes: changeNotes,
      onNotesChange: setChangeNotes,
    },
    pendingChanges
  };
}
