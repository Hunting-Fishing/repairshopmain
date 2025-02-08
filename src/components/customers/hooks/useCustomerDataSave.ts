
import { supabase } from "@/integrations/supabase/client";
import { CustomerFormValues } from "../types/customerTypes";
import { useQuery } from "@tanstack/react-query";

export function useCustomerDataSave() {
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
      change_type: "update",
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

  const saveCustomer = async (
    values: CustomerFormValues,
    userId: string,
    notes: string,
    mode: "create" | "edit",
    initialData?: any
  ) => {
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

    if (mode === "edit" && data) {
      const changes = Object.keys(values).reduce((acc, key) => {
        if (values[key as keyof CustomerFormValues] !== initialData[key]) {
          acc[key] = {
            old: initialData[key],
            new: values[key as keyof CustomerFormValues],
          };
        }
        return acc;
      }, {} as Record<string, { old: any; new: any }>);

      if (Object.keys(changes).length > 0) {
        await createHistoryRecords(initialData.id, userId, changes, notes);
      }
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

    return data;
  };

  return {
    userProfile,
    saveCustomer,
  };
}
