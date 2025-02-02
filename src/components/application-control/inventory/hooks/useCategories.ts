import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Category, CategoryFormData } from "../types";

export function useCategories(organizationId?: string) {
  const queryClient = useQueryClient();

  const { 
    data: categories = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['inventory-categories', organizationId],
    queryFn: async () => {
      if (!organizationId) {
        console.warn('No organization ID found');
        return [];
      }
      
      const { data, error } = await supabase
        .from('inventory_categories')
        .select('*')
        .eq('organization_id', organizationId)
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }

      return data as Category[];
    },
    enabled: !!organizationId
  });

  const { mutateAsync: addCategory, isPending: isAddingCategory } = useMutation({
    mutationFn: async (input: CategoryFormData) => {
      if (!organizationId) {
        throw new Error("No organization ID found");
      }

      const categoryData = {
        ...input,
        organization_id: organizationId
      };

      const { data, error } = await supabase
        .from('inventory_categories')
        .insert([categoryData])
        .select()
        .single();

      if (error) {
        console.error('Error adding category:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-categories'] });
    }
  });

  return {
    categories,
    isLoading,
    error,
    addCategory,
    isAddingCategory
  };
}