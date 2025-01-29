import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { CustomerFormFields } from "./form/CustomerFormFields";
import { CustomerAddressFields } from "./form/CustomerAddressFields";
import { ChangeNotesDialog } from "./form/ChangeNotesDialog";

interface CustomerFormProps {
  onSuccess: () => void;
  initialData?: any;
  mode?: "create" | "edit";
}

interface CustomerFormValues {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  street_address: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
  notes: string;
}

export function CustomerForm({ onSuccess, initialData, mode = "create" }: CustomerFormProps) {
  const { toast } = useToast();
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [changeNotes, setChangeNotes] = useState("");
  const [pendingChanges, setPendingChanges] = useState<any>(null);
  
  const form = useForm<CustomerFormValues>({
    defaultValues: initialData || {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      street_address: "",
      city: "",
      state_province: "",
      postal_code: "",
      country: "",
      notes: "",
    },
  });

  const { data: userProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", session.user.id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const createHistoryRecords = async (
    customerId: string,
    userId: string,
    changes: Record<string, { old: any; new: any }>,
    notes: string
  ) => {
    const historyRecords = Object.entries(changes).map(([field, values]) => ({
      customer_id: customerId,
      changed_by: userId,
      change_type: mode === "create" ? "create" : "update",
      field_name: field,
      old_value: values.old?.toString() || null,
      new_value: values.new?.toString() || null,
      notes,
    }));

    const { error } = await supabase
      .from("customer_history")
      .insert(historyRecords);

    if (error) throw error;
  };

  const handleSubmit = async (values: CustomerFormValues) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user.id || !userProfile?.organization_id) {
        throw new Error("User session or organization not found");
      }

      // Calculate changes if in edit mode
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

      // If creating or no changes detected, proceed without notes
      await saveCustomer(values, session.user.id, "");
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: `Error ${mode === "create" ? "adding" : "updating"} customer`,
        description: error.message,
      });
    }
  };

  const saveCustomer = async (values: CustomerFormValues, userId: string, notes: string) => {
    const { data, error } = mode === "create"
      ? await supabase
          .from("customers")
          .insert({
            ...values,
            organization_id: userProfile?.organization_id,
            created_by: userId,
            updated_by: userId,
          })
          .select()
          .single()
      : await supabase
          .from("customers")
          .update({
            ...values,
            updated_by: userId,
          })
          .eq("id", initialData.id)
          .select()
          .single();

    if (error) throw error;

    if (mode === "edit" && pendingChanges) {
      await createHistoryRecords(
        initialData.id,
        userId,
        pendingChanges.changes,
        notes
      );
    } else if (mode === "create" && data) {
      await createHistoryRecords(
        data.id,
        userId,
        Object.keys(values).reduce((acc, key) => ({
          ...acc,
          [key]: { old: null, new: values[key as keyof CustomerFormValues] },
        }), {}),
        "Initial customer creation"
      );
    }
  };

  const handleNotesSubmit = async () => {
    if (!pendingChanges) return;

    try {
      await saveCustomer(
        pendingChanges.values,
        pendingChanges.userId,
        changeNotes
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

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <CustomerFormFields form={form} />
          <CustomerAddressFields form={form} />
          <Button type="submit" className="w-full">
            {mode === "create" ? "Add Customer" : "Update Customer"}
          </Button>
        </form>
      </Form>

      <ChangeNotesDialog
        open={showNotesDialog}
        onOpenChange={setShowNotesDialog}
        notes={changeNotes}
        onNotesChange={setChangeNotes}
        onSubmit={handleNotesSubmit}
      />
    </>
  );
}
