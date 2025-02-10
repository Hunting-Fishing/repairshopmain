
import { supabase } from "@/integrations/supabase/client";
import { CustomerFormValues } from "../types/customerTypes";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCustomerDataSave() {
  const { data: userProfile, error: profileError } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user.id) {
        throw new Error("No authenticated user found");
      }
      
      const { data, error } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", session.user.id)
        .single();
        
      if (error) {
        console.error("Error fetching user profile:", error);
        throw error;
      }
      
      return data;
    },
    retry: 1,
  });

  const createHistoryRecords = async (
    customerId: string,
    userId: string,
    changes: Record<string, { old: any; new: any }>,
    notes: string
  ) => {
    try {
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

      if (error) {
        console.error("Error creating history records:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error in createHistoryRecords:", error);
      toast.error("Failed to create history records");
      throw error;
    }
  };

  const saveCustomer = async (
    values: CustomerFormValues,
    userId: string,
    notes: string,
    mode: "create" | "edit",
    initialData?: any
  ) => {
    try {
      if (!userProfile?.organization_id) {
        throw new Error("No organization ID found");
      }

      const { data, error } = mode === "create"
        ? await supabase
            .from("customers")
            .insert({
              ...values,
              organization_id: userProfile.organization_id,
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

      if (error) {
        console.error("Error saving customer:", error);
        toast.error(error.message);
        throw error;
      }

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

      toast.success(`Customer ${mode === "create" ? "created" : "updated"} successfully`);
      return data;
    } catch (error) {
      console.error("Error in saveCustomer:", error);
      throw error;
    }
  };

  return {
    userProfile,
    profileError,
    saveCustomer,
  };
}
