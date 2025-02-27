
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../../types/customerTypes";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useCustomerType(form: UseFormReturn<CustomerFormValues>) {
  const customerType = form.watch("customer_type");
  const businessClassification = form.watch("business_classification_id");
  const { toast } = useToast();
  const isInitialMount = useRef(true);
  const previousType = useRef(customerType);
  const [showOtherField, setShowOtherField] = useState(false);

  useEffect(() => {
    if (!isInitialMount.current && previousType.current === "Business" && customerType !== "Business") {
      form.setValue("company_name", "");
      form.setValue("business_classification_id", "");
      form.setValue("business_classification_other", "");
      form.setValue("tax_number", "");
      form.clearErrors(["company_name", "business_classification_id", "tax_number"]);
      setShowOtherField(false);
    }
    previousType.current = customerType;
  }, [customerType, form]);

  useEffect(() => {
    setShowOtherField(businessClassification === "other");
    if (businessClassification !== "other") {
      form.setValue("business_classification_other", "");
    }
  }, [businessClassification, form]);

  const saveOtherClassification = async (otherValue: string) => {
    if (businessClassification === "other" && otherValue) {
      try {
        const customerId = form.getValues("id");
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No authenticated user");

        const { data: profile } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', user.id)
          .single();

        if (!profile?.organization_id) throw new Error("No organization found");

        const { error } = await supabase
          .from('business_classification_others')
          .insert({
            customer_id: customerId,
            classification_type: "business",
            other_description: otherValue,
            organization_id: profile.organization_id
          });

        if (error) throw error;
      } catch (error) {
        console.error("Error saving other classification:", error);
        toast({
          title: "Error saving classification",
          description: "There was an error saving the other classification",
          variant: "destructive"
        });
      }
    }
  };

  return {
    customerType,
    showOtherField,
    saveOtherClassification
  };
}
