
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AmazonAssociatesSettings {
  tracking_enabled: boolean;
  auto_link_enabled: boolean;
  default_marketplace: string;
  partner_tag: string | null;
  api_region: string;
  partner_type: string;
  api_version: string;
  marketplace_endpoints: Record<string, string>;
  request_quota: {
    hourly: number;
    daily: number;
    used_hourly: number;
    used_daily: number;
    last_reset: string | null;
  };
  rate_limit_config: {
    retry_after: number;
    max_retries: number;
    backoff_multiplier: number;
  };
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
          default_marketplace: 'US',
          partner_tag: null,
          api_region: 'us-west-2',
          partner_type: 'Associates',
          api_version: 'v5',
          marketplace_endpoints: {
            "US": "webservices.amazon.com",
            "UK": "webservices.amazon.co.uk",
            "DE": "webservices.amazon.de",
            "FR": "webservices.amazon.fr",
            "JP": "webservices.amazon.co.jp",
            "CA": "webservices.amazon.ca",
            "IT": "webservices.amazon.it",
            "ES": "webservices.amazon.es",
            "IN": "webservices.amazon.in",
            "BR": "webservices.amazon.com.br",
            "MX": "webservices.amazon.com.mx",
            "AU": "webservices.amazon.com.au",
            "AE": "webservices.amazon.ae",
            "SG": "webservices.amazon.sg",
            "TR": "webservices.amazon.com.tr",
            "NL": "webservices.amazon.nl"
          },
          request_quota: {
            hourly: 8640,
            daily: 207360,
            used_hourly: 0,
            used_daily: 0,
            last_reset: null
          },
          rate_limit_config: {
            retry_after: 1000,
            max_retries: 3,
            backoff_multiplier: 2
          }
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
    meta: {
      errorMessage: "Failed to load Amazon Associates settings"
    },
    retry: false
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
