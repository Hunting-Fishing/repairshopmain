import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrganizationData } from "@/hooks/staff/useOrganizationData";

export function useInventoryCategories() {
  const { userProfile } = useOrganizationData();

  const { data: categories } = useQuery({
    queryKey: ['inventory-categories'],
    queryFn: async () => {
      if (!userProfile?.organization_id) return [];
      
      const { data, error } = await supabase
        .from('inventory_categories')
        .select('*')
        .eq('organization_id', userProfile.organization_id)
        .throwOnError();
      return data || [];
    },
    enabled: !!userProfile?.organization_id
  });

  return { categories };
}