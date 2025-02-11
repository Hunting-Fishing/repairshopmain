
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useLoyaltySettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["loyalty-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loyalty_program_settings")
        .select("*")
        .single();

      if (error) throw error;
      return data;
    }
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: {
      tier_settings: any;
      point_settings: any;
    }) => {
      const { error } = await supabase
        .from("loyalty_program_settings")
        .update({
          tier_settings: newSettings.tier_settings,
          point_settings: newSettings.point_settings,
        })
        .eq("id", settings?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-settings"] });
      toast({
        title: "Settings updated",
        description: "Loyalty program settings have been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update loyalty settings: " + error.message,
      });
    },
  });

  return {
    settings,
    isLoading,
    updateSettings,
  };
}
