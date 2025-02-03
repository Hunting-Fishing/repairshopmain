import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { queryKeys } from "./useQueryKeys";
import { toast } from "sonner";
import { useEffect } from "react";
import type { InventoryItem, InventoryCategory, InventorySupplier } from "@/components/application-control/inventory/types";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export function useInventoryData(organizationId?: string) {
  const queryClient = useQueryClient();

  const {
    data: categories,
    isLoading: categoriesLoading,
  } = useQuery({
    queryKey: queryKeys.inventory.categories,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_categories")
        .select("*")
        .eq("organization_id", organizationId)
        .order("name");

      if (error) {
        toast.error("Failed to load categories");
        throw error;
      }
      return data as InventoryCategory[];
    },
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
  });

  const {
    data: items,
    isLoading: itemsLoading,
  } = useQuery({
    queryKey: queryKeys.inventory.all,
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

      if (error) {
        toast.error("Failed to load inventory items");
        throw error;
      }
      return data as InventoryItem[];
    },
    enabled: !!organizationId,
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
    gcTime: 15 * 60 * 1000, // Keep in cache for 15 minutes
  });

  const {
    data: suppliers,
    isLoading: suppliersLoading,
  } = useQuery({
    queryKey: queryKeys.inventory.suppliers,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_suppliers")
        .select("*")
        .eq("organization_id", organizationId)
        .order("name");

      if (error) {
        toast.error("Failed to load suppliers");
        throw error;
      }
      return data as InventorySupplier[];
    },
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
  });

  // Set up real-time subscription for inventory updates
  useEffect(() => {
    if (!organizationId) return;

    const channel = supabase
      .channel('inventory-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory_items'
        },
        (payload: RealtimePostgresChangesPayload<InventoryItem>) => {
          // Invalidate queries when data changes
          queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all });
          toast.info("Inventory updated");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [organizationId, queryClient]);

  return {
    categories,
    items,
    suppliers,
    isLoading: categoriesLoading || itemsLoading || suppliersLoading,
  };
}