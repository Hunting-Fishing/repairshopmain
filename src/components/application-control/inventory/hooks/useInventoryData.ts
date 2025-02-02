import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useOrganizationData } from "@/hooks/staff/useOrganizationData";
import type { InventoryItem, InventoryCategory, InventorySupplier, InventoryItemFormData, CategoryFormData } from "../types";

export function useInventoryData() {
  const queryClient = useQueryClient();
  const { userProfile } = useOrganizationData();
  const organizationId = userProfile?.organization_id;

  // Categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["inventory-categories", organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_categories")
        .select("*")
        .eq("organization_id", organizationId)
        .order("name");

      if (error) throw error;
      return data as InventoryCategory[];
    },
    enabled: !!organizationId,
  });

  // Items
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

  // Suppliers
  const { data: suppliers, isLoading: suppliersLoading } = useQuery({
    queryKey: ["inventory-suppliers", organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_suppliers")
        .select("*")
        .eq("organization_id", organizationId)
        .order("name");

      if (error) throw error;
      return data as InventorySupplier[];
    },
    enabled: !!organizationId,
  });

  // Add Category
  const { mutateAsync: addCategory } = useMutation({
    mutationFn: async (data: CategoryFormData) => {
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

  // Add Item
  const { mutateAsync: addItem } = useMutation({
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
    categories,
    items,
    suppliers,
    isLoading: categoriesLoading || itemsLoading || suppliersLoading,
    addCategory,
    addItem,
  };
}