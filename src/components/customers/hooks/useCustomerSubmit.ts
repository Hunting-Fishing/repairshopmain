
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

      // Remove undefined and null values
      const cleanedValues = Object.fromEntries(
        Object.entries(values).filter(([_, v]) => v != null)
      );

      let result;
      if (mode === "edit" && initialData?.id) {
        console.log("Updating customer with ID:", initialData.id);
        
        // Prepare update data
        const updateData = {
          ...cleanedValues,
          updated_at: new Date().toISOString()
        };
        
        // Remove id from update data as it's used in the where clause
        delete updateData.id;
        
        console.log("Sending update with data:", updateData);
        
        result = await supabase
          .from("customers")
          .update(updateData)
          .eq('id', initialData.id)
          .select()
          .single();

        console.log("Update result:", result);
      } else {
        result = await supabase
          .from("customers")
          .insert([cleanedValues])
          .select()
          .single();
      }

      if (result.error) {
        console.error("Database operation failed:", result.error);
        throw result.error;
      }

      if (!result.data) {
        throw new Error("No data returned from the database");
      }

      console.log("Operation successful:", result.data);

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
