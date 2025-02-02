import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { InventoryItem, InventoryItemFormData } from "../types";

export function useItems(organizationId?: string) {
  const queryClient = useQueryClient();

  const { data: items, isLoading: itemsLoading } = useQuery({
    queryKey: ["inventory-items", organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_items")
        .select(`
          *,
          category:inventory_categories(name),
          supplier:inventory_suppliers(name)
        `)
        .eq("organization_id", organizationId)
        .order("name");

      if (error) throw error;
      return data as (InventoryItem & {
        category: { name: string } | null;
        supplier: { name: string } | null;
      })[];
    },
    enabled: !!organizationId,
  });

  const { mutateAsync: addItem, isPending: isAddingItem } = useMutation({
    mutationFn: async (data: InventoryItemFormData) => {
      const { error } = await supabase
        .from("inventory_items")
        .insert([{ ...data, organization_id: organizationId }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      toast.success("Item added successfully");
    },
    onError: (error) => {
      console.error("Error adding item:", error);
      toast.error("Failed to add item");
    },
  });

  return {
    items,
    isLoading: itemsLoading,
    addItem,
    isAddingItem,
  };
}