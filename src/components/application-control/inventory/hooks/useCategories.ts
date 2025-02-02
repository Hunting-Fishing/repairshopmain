import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { InventoryCategory, CategoryFormData } from "../types";

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
        throw new Error('No organization ID provided');
      }
      
      const { data, error } = await supabase
        .from('inventory_categories')
        .select('*')
        .eq('organization_id', organizationId)
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        throw new Error(error.message);
      }

      return data as InventoryCategory[];
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
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-categories'] });
      toast.success('Category added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add category: ${error.message}`);
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