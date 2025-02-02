import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrganizationData } from "@/hooks/staff/useOrganizationData";

interface CategoryInput {
  name: string;
  description?: string;
}

export function useAddCategory() {
  const queryClient = useQueryClient();
  const { userProfile } = useOrganizationData();

  const { mutateAsync: addCategory, isPending } = useMutation({
    mutationFn: async (input: CategoryInput) => {
      if (!userProfile?.organization_id) {
        console.error('No organization ID found when adding category');
        throw new Error("No organization ID found");
      }

      const categoryData = {
        ...input,
        organization_id: userProfile.organization_id
      };

      console.log('Adding category with data:', categoryData);

      const { data, error } = await supabase
        .from('inventory_categories')
        .insert([categoryData])
        .select()
        .single();

      if (error) {
        console.error('Error adding category:', error);
        throw error;
      }

      console.log('Category added successfully:', data);
      return data;
    },
    onSuccess: () => {
      console.log('Invalidating categories query cache');
      queryClient.invalidateQueries({ queryKey: ['inventory-categories'] });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
    }
  });

  return { addCategory, isLoading: isPending };
}