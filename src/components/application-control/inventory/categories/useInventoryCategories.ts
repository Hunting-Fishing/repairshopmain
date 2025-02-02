import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrganizationData } from "@/hooks/staff/useOrganizationData";
import { toast } from "@/components/ui/use-toast";

export function useInventoryCategories() {
  const { userProfile } = useOrganizationData();

  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['inventory-categories', userProfile?.organization_id],
    queryFn: async () => {
      console.log('Organization ID from profile:', userProfile?.organization_id);
      
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
        console.error('Supabase query error:', error);
        toast({
          title: "Error loading categories",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      if (!data || data.length === 0) {
        console.log('No categories found for organization');
      } else {
        console.log(`Found ${data.length} categories:`, data);
      }

      return data || [];
    },
    enabled: !!userProfile?.organization_id,
    retry: 1,
    staleTime: 30000, // Cache data for 30 seconds
    onError: (error: Error) => {
      console.error('Query error:', error);
      toast({
        title: "Error loading categories",
        description: "Failed to load inventory categories. Please try again.",
        variant: "destructive",
      });
    }
  });

  return { 
    categories, 
    isLoading, 
    error,
    organizationId: userProfile?.organization_id 
  };
}