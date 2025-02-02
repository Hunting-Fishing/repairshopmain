import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrganizationData } from "@/hooks/staff/useOrganizationData";

export function useInventoryCategories() {
  const { userProfile } = useOrganizationData();

  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['inventory-categories', userProfile?.organization_id],
    queryFn: async () => {
      console.log('Fetching categories for organization:', userProfile?.organization_id);
      
      if (!userProfile?.organization_id) {
        console.log('No organization ID found');
        return [];
      }
      
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

      console.log('Fetched categories:', data);
      return data || [];
    },
    enabled: !!userProfile?.organization_id
  });

  if (error) {
    console.error('Query error:', error);
  }

  return { categories, isLoading, error };
}