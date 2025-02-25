
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

      // Validate required fields
      if (!values.first_name?.trim() || !values.last_name?.trim()) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "First name and last name are required fields.",
        });
        return;
      }

      if (!values.email?.trim()) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Email address is required.",
        });
        return;
      }

      // Email format validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please enter a valid email address.",
        });
        return;
      }

      // Phone number format validation (if provided)
      if (values.phone_number && !/^\+?[\d\s-]{10,}$/.test(values.phone_number)) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please enter a valid phone number.",
        });
        return;
      }

      // Remove undefined and null values
      const cleanedValues = Object.fromEntries(
        Object.entries(values).filter(([_, v]) => v != null)
      );

      let result;
      if (mode === "edit" && initialData?.id) {
        if (!initialData.id) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Customer ID is missing. Please refresh the page and try again.",
          });
          return;
        }

        console.log("Updating customer with ID:", initialData.id);
        
        // Create a type-safe update object that includes all the cleaned values
        const updateData: Partial<CustomerFormValues> & { updated_at: string } = {
          ...cleanedValues,
          updated_at: new Date().toISOString()
        };
        
        // Now TypeScript knows updateData can have an id property
        if ('id' in updateData) {
          delete updateData.id;
        }
        
        console.log("Sending update with data:", updateData);
        
        result = await supabase
          .from("customers")
          .update(updateData)
          .eq('id', initialData.id)
          .select()
          .single();

        if (result.error) {
          if (result.error.code === '23505') { // Unique constraint violation
            toast({
              variant: "destructive",
              title: "Update Failed",
              description: "This email address is already in use by another customer.",
            });
            return;
          }
          
          if (result.error.code === '42P01') { // Table does not exist
            console.error("Database table error:", result.error);
            toast({
              variant: "destructive",
              title: "System Error",
              description: "A database error occurred. Please contact support.",
            });
            return;
          }

          if (result.error.code === '23503') { // Foreign key violation
            toast({
              variant: "destructive",
              title: "Update Failed",
              description: "Unable to update customer due to related data constraints.",
            });
            return;
          }

          // Generic database error
          console.error("Database error:", result.error);
          toast({
            variant: "destructive",
            title: "Update Failed",
            description: "An error occurred while updating the customer. Please try again.",
          });
          return;
        }

        if (!result.data) {
          toast({
            variant: "destructive",
            title: "Update Failed",
            description: "Could not find the customer to update. Please refresh and try again.",
          });
          return;
        }

      } else {
        // Handle create operation
        result = await supabase
          .from("customers")
          .insert([cleanedValues])
          .select()
          .single();

        if (result.error) {
          console.error("Create operation failed:", result.error);
          toast({
            variant: "destructive",
            title: "Creation Failed",
            description: "Failed to create new customer. Please try again.",
          });
          return;
        }
      }

      console.log("Operation successful:", result.data);

      onSuccess();
      toast({
        title: "Success",
        description: `Customer has been ${mode === "edit" ? "updated" : "created"} successfully.`,
      });
    } catch (error: any) {
      console.error("Form submission error:", error);
      
      // Network or unexpected errors
      if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Please check your internet connection and try again.",
        });
        return;
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again or contact support.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};
