
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CustomerFormValues } from "../types/customerTypes";
import { useCustomerFormData } from "./useCustomerFormData";
import { useCustomerDataSave } from "./useCustomerDataSave";

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
  const [pendingChanges, setPendingChanges] = useState<any>(null);

  const { form } = useCustomerFormData({ initialData });
  const { saveCustomer } = useCustomerDataSave();

  const handleSubmit = async (values: CustomerFormValues) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user.id) {
        throw new Error("User session not found");
      }

      if (mode === "edit") {
        const changes: Record<string, { old: any; new: any }> = {};
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

      await saveCustomer(values, session.user.id, "", mode, initialData);
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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user.id) {
        throw new Error("User session not found");
      }

      await saveCustomer(
        pendingChanges.values,
        session.user.id,
        changeNotes,
        mode,
        initialData
      );
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
