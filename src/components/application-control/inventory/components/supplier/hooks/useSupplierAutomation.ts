import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SupplierAutomationSettings } from "../../../types";

export function useSupplierAutomation(supplierId: string) {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["supplier-automation", supplierId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("supplier_automation_settings")
        .select("*")
        .eq("supplier_id", supplierId)
        .maybeSingle();

      if (error) throw error;
      return data as SupplierAutomationSettings;
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: SupplierAutomationSettings) => {
      const { error } = await supabase
        .from("supplier_automation_settings")
        .upsert({
          supplier_id: supplierId,
          ...newSettings
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier-automation", supplierId] });
    },
  });

  return {
    settings,
    isLoading,
    updateSettings,
  };
}