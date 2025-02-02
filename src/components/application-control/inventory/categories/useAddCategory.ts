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
        throw new Error("No organization ID found");
      }

      console.log('Adding category:', {
        ...input,
        organization_id: userProfile.organization_id
      });

      const { data, error } = await supabase
        .from('inventory_categories')
        .insert([
          {
            ...input,
            organization_id: userProfile.organization_id
          }
        ])
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
      queryClient.invalidateQueries({ queryKey: ['inventory-categories'] });
    }
  });

  return { addCategory, isLoading: isPending };
}