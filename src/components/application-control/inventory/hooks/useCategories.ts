import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { InventoryCategory, CategoryFormData } from "../types";

export function useCategories(organizationId?: string) {
  const queryClient = useQueryClient();

  // Add console.log to debug
  console.log("useCategories - Fetching categories for organization:", organizationId);

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["inventory-categories", organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_categories")
        .select("*")
        .eq("organization_id", organizationId)
        .order("name");

      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
      
      // Add console.log to debug
      console.log("useCategories - Fetched categories:", data);
      return data as InventoryCategory[];
    },
    enabled: !!organizationId,
  });

  const { mutateAsync: addCategory, isPending: isAddingCategory } = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      console.log("Adding category with data:", data, "for organization:", organizationId);
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

  return {
    categories,
    isLoading: categoriesLoading,
    addCategory,
    isAddingCategory,
  };
}