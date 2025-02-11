
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useLoyaltySettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["loyalty-settings"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) throw new Error("Not authenticated");

      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", session.user.id)
        .single();

      if (!profile?.organization_id) throw new Error("No organization found");

      const { data, error } = await supabase
        .from("loyalty_program_settings")
        .select("*")
        .eq("organization_id", profile.organization_id)
        .single();

      if (error) {
        // If settings don't exist yet, create them
        if (error.code === 'PGRST116') {
          const { data: newSettings, error: createError } = await supabase
            .from("loyalty_program_settings")
            .insert({
              organization_id: profile.organization_id,
              created_by: session.user.id
            })
            .select()
            .single();

          if (createError) throw createError;
          return newSettings;
        }
        throw error;
      }

      return data;
    }
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: {
      tier_settings: any;
      point_settings: any;
    }) => {
      if (!settings?.id) throw new Error("Settings not found");

      const { error } = await supabase
        .from("loyalty_program_settings")
        .update({
          tier_settings: newSettings.tier_settings,
          point_settings: newSettings.point_settings,
        })
        .eq("id", settings.id);

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

