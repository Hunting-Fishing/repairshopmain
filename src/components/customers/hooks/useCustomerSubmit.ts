
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CustomerFormValues } from "../types/customerTypes";
import { validatePhone, validateEmail, validateAddress, logValidationAttempt } from "@/utils/validation";

interface UseCustomerSubmitProps {
  mode: "create" | "edit";
  initialData?: CustomerFormValues;
  onSuccess: () => void;
}

export const useCustomerSubmit = ({ mode, initialData, onSuccess }: UseCustomerSubmitProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: CustomerFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Handling submit in mode:", mode, "with values:", values);

      const emailValidation = await validateEmail(values.email);
      if (!emailValidation.isValid) {
        toast({
          title: "Validation Error",
          description: emailValidation.message,
          variant: "destructive",
        });
        return;
      }

      if (values.phone_number) {
        const phoneValidation = await validatePhone(values.phone_number);
        if (!phoneValidation.isValid) {
          toast({
            title: "Validation Error",
            description: phoneValidation.message,
            variant: "destructive",
          });
          return;
        }
      }

      if (values.street_address && values.city && values.state_province && values.postal_code && values.country) {
        const addressValidation = await validateAddress(
          values.street_address,
          values.city,
          values.state_province,
          values.postal_code,
          values.country
        );
        if (!addressValidation.isValid) {
          toast({
            title: "Validation Error",
            description: addressValidation.message,
            variant: "destructive",
          });
          return;
        }
      }

      let operation;
      if (mode === "edit" && initialData?.id) {
        console.log("Updating customer with ID:", initialData.id);
        operation = supabase
          .from("customers")
          .update({
            ...values,
            email_validation_status: emailValidation.isValid ? 'valid' : 'invalid',
            phone_validation_status: values.phone_number ? (await validatePhone(values.phone_number)).isValid ? 'valid' : 'invalid' : 'pending',
            address_validation_status: (values.street_address && values.city && values.state_province && values.postal_code && values.country) ? 'valid' : 'pending',
            updated_at: new Date().toISOString()
          })
          .eq('id', initialData.id)
          .select();

        const { data: customer, error } = await operation;

        if (error) {
          console.error("Database update failed:", error);
          throw error;
        }

        console.log("Update successful:", customer);
      } else {
        operation = supabase
          .from("customers")
          .insert([{
            ...values,
            email_validation_status: emailValidation.isValid ? 'valid' : 'invalid',
            phone_validation_status: values.phone_number ? (await validatePhone(values.phone_number)).isValid ? 'valid' : 'invalid' : 'pending',
            address_validation_status: (values.street_address && values.city && values.state_province && values.postal_code && values.country) ? 'valid' : 'pending'
          }])
          .select();
      }

      const { data: customer, error } = await operation;

      if (error) {
        console.error("Database operation failed:", error);
        throw error;
      }

      if (!customer) {
        throw new Error("No data returned from the database");
      }

      // Log validation attempts
      await logValidationAttempt(Array.isArray(customer) ? customer[0].id : customer.id, 'email', emailValidation.isValid ? 'valid' : 'invalid', emailValidation.message);
      if (values.phone_number) {
        const phoneValidation = await validatePhone(values.phone_number);
        await logValidationAttempt(Array.isArray(customer) ? customer[0].id : customer.id, 'phone', phoneValidation.isValid ? 'valid' : 'invalid', phoneValidation.message);
      }
      if (values.street_address) {
        const addressValidation = await validateAddress(
          values.street_address,
          values.city,
          values.state_province,
          values.postal_code,
          values.country
        );
        await logValidationAttempt(Array.isArray(customer) ? customer[0].id : customer.id, 'address', addressValidation.isValid ? 'valid' : 'invalid', addressValidation.message);
      }

      onSuccess();
      toast({
        title: "Success",
        description: `Customer has been ${mode === "edit" ? "updated" : "created"} successfully.`,
      });
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};
