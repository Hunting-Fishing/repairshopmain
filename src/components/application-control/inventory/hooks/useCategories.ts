import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { InventoryCategory, CategoryFormData } from "../types";

export function useCategories(organizationId?: string) {
  const queryClient = useQueryClient();

  const { data: categories, isLoading: categoriesLoading, error } = useQuery({
    queryKey: ["inventory-categories", organizationId],
    queryFn: async () => {
      console.log("useCategories - Starting fetch for organization:", organizationId);
      
      const { data, error } = await supabase
        .from("inventory_categories")
        .select("*")
        .eq("organization_id", organizationId)
        .order("name");

      if (error) {
        console.error("useCategories - Error fetching categories:", error);
        throw error;
      }
      
      console.log("useCategories - Raw data from Supabase:", data);
      console.log("useCategories - SQL Query:", `SELECT * FROM inventory_categories WHERE organization_id = '${organizationId}' ORDER BY name`);
      return data as InventoryCategory[];
    },
    enabled: !!organizationId,
  });

  const { mutateAsync: addCategory, isPending: isAddingCategory } = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      console.log("useCategories - Adding new category:", data);
      const { error } = await supabase
        .from("inventory_categories")
        .insert([{ ...data, organization_id: organizationId }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-categories"] });
      toast.success("Category added successfully");
    },
    onError: (error) => {
      console.error("Error adding category:", error);
      toast.error("Failed to add category");
    },
  });

  console.log("useCategories - Returning categories:", categories);

  return {
    categories,
    isLoading: categoriesLoading,
    error,
    addCategory,
    isAddingCategory,
  };
}