import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { InventorySupplier } from "../types";

export function useSuppliers(organizationId?: string) {
  const { data: suppliers, isLoading: suppliersLoading, error } = useQuery({
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

  return {
    suppliers,
    isLoading: suppliersLoading,
    error: error as Error | null,
  };
}