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
      const { data: settings } = await supabase
        .from('amazon_associates_settings')
        .select('*')
        .single();
      return settings;
    }
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<AmazonAssociatesSettings>) => {
      const { data, error } = await supabase
        .from('amazon_associates_settings')
        .update(newSettings)
        .eq('id', settings?.id)
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