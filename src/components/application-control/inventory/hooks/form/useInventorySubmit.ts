
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useInventoryValidation } from "./useInventoryValidation";
import type { InventoryFormSchema } from "../../components/inventory-dialog/form-sections/validation";

export function useInventorySubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { validateInventoryForm } = useInventoryValidation();

  const handleSubmit = async (values: InventoryFormSchema) => {
    if (!validateInventoryForm(values)) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("inventory_items")
        .insert([values]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
}
