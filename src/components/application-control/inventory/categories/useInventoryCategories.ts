import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrganizationData } from "@/hooks/staff/useOrganizationData";

export function useInventoryCategories() {
  const { userProfile } = useOrganizationData();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['inventory-categories', userProfile?.organization_id],
    queryFn: async () => {
      if (!userProfile?.organization_id) return [];
      
      const { data, error } = await supabase
        .from('inventory_categories')
        .select('*')
        .eq('organization_id', userProfile.organization_id)
        .order('name')
        .throwOnError();

      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!userProfile?.organization_id
  });

  return { categories, isLoading };
}