import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrganizationData } from "@/hooks/staff/useOrganizationData";
import { toast } from "sonner";

export function useInventoryCategories() {
  const { userProfile } = useOrganizationData();

  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['inventory-categories', userProfile?.organization_id],
    queryFn: async () => {
      console.log('Fetching categories - Organization ID:', userProfile?.organization_id);
      
      if (!userProfile?.organization_id) {
        console.warn('No organization ID found in user profile');
        return [];
      }
      
      const { data, error } = await supabase
        .from('inventory_categories')
        .select('*')
        .eq('organization_id', userProfile.organization_id)
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }

      console.log('Categories query response:', {
        count: data?.length || 0,
        data: data || []
      });
      
      return data || [];
    },
    enabled: !!userProfile?.organization_id,
    meta: {
      errorMessage: "Failed to load inventory categories"
    }
  });

  // Handle error with a side effect
  if (error) {
    console.error('Query error:', error);
    toast.error("Failed to load inventory categories");
  }

  return { 
    categories, 
    isLoading, 
    error,
    organizationId: userProfile?.organization_id 
  };
}