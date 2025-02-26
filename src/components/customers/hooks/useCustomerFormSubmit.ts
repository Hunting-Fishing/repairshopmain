
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CustomerFormValues } from "../types/customerTypes";
import { useCustomerFormData } from "./useCustomerFormData";
import { useCustomerDataSave } from "./useCustomerDataSave";

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
  initialData?: any;
  mode: "create" | "edit";
}) {
  const { toast } = useToast();
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [changeNotes, setChangeNotes] = useState("");
  const [pendingChanges, setPendingChanges] = useState<PendingChanges | null>(null);

  const { form } = useCustomerFormData({ initialData });
  const { updateField } = useCustomerDataSave(initialData?.id || "new");

  const handleSubmit = async (values: CustomerFormValues) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user.id) {
        throw new Error("User session not found");
      }

      if (mode === "edit") {
        const changes: Record<string, ChangeRecord> = {};
        Object.keys(values).forEach((key) => {
          if (values[key as keyof CustomerFormValues] !== initialData[key]) {
            changes[key] = {
              old: initialData[key],
              new: values[key as keyof CustomerFormValues],
            };
          }
        });

        if (Object.keys(changes).length > 0) {
          setPendingChanges({
            values,
            changes,
            userId: session.user.id,
          });
          setShowNotesDialog(true);
          return;
        }
      }

      // For edit mode, update each changed field individually
      if (mode === "edit" && initialData?.id) {
        for (const [key, value] of Object.entries(values)) {
          if (value !== initialData[key]) {
            await updateField({ 
              field: key as keyof CustomerFormValues, 
              value 
            });
          }
        }
      } else {
        // For create mode, insert new customer
        const { error } = await supabase
          .from('customers')
          .insert([values]);
        
        if (error) throw error;
      }

      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: `Error ${mode === "create" ? "adding" : "updating"} customer`,
        description: error.message,
      });
    }
  };

  const handleNotesSubmit = async () => {
    if (!pendingChanges) return;

    try {
      // Update each changed field with the notes
      for (const [key, change] of Object.entries(pendingChanges.changes)) {
        await updateField({ 
          field: key as keyof CustomerFormValues, 
          value: change.new 
        });
      }

      setShowNotesDialog(false);
      setPendingChanges(null);
      setChangeNotes("");
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating customer",
        description: error.message,
      });
    }
  };

  return {
    form,
    handleSubmit,
    showNotesDialog: {
      open: showNotesDialog,
      onOpenChange: setShowNotesDialog,
      notes: changeNotes,
      onNotesChange: setChangeNotes,
    },
    handleNotesSubmit,
    pendingChanges,
  };
}
