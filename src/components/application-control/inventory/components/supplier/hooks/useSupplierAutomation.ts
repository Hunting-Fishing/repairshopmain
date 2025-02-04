import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useSupplierAutomation(supplierId: string) {
  const { toast } = useToast();
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
      return data;
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: typeof settings) => {
      const { error } = await supabase
        .from("supplier_automation_settings")
        .upsert(newSettings);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier-automation", supplierId] });
      toast({
        title: "Settings updated",
        description: "Automation settings have been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update automation settings.",
        variant: "destructive",
      });
      console.error("Error updating automation settings:", error);
    },
  });

  return {
    settings,
    isLoading,
    updateSettings,
  };
}