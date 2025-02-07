import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AmazonAssociatesSettings {
  tracking_enabled: boolean;
  auto_link_enabled: boolean;
  default_marketplace: string;
}

export function useAmazonAssociates() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['amazon-associates-settings'],
    queryFn: async () => {
      // First, get the user's organization_id
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (!profile?.organization_id) throw new Error("No organization found");

      // Try to get existing settings
      const { data: existingSettings, error } = await supabase
        .from('amazon_associates_settings')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // If no settings exist, create default settings
      if (!existingSettings) {
        const defaultSettings = {
          organization_id: profile.organization_id,
          tracking_enabled: false,
          auto_link_enabled: false,
          default_marketplace: 'US'
        };

        const { data: newSettings, error: insertError } = await supabase
          .from('amazon_associates_settings')
          .insert(defaultSettings)
          .select()
          .single();

        if (insertError) throw insertError;
        return newSettings;
      }

      return existingSettings;
    },
    retry: false,
    onError: (error) => {
      console.error('Error fetching Amazon Associates settings:', error);
      toast.error("Failed to load Amazon Associates settings");
    }
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<AmazonAssociatesSettings>) => {
      if (!settings?.id) throw new Error("No settings found to update");

      const { data, error } = await supabase
        .from('amazon_associates_settings')
        .update(newSettings)
        .eq('id', settings.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amazon-associates-settings'] });
      toast.success("Amazon Associates settings updated");
    },
    onError: (error) => {
      console.error('Error updating settings:', error);
      toast.error("Failed to update settings");
    }
  });

  return {
    settings,
    isLoading,
    updateSettings
  };
}