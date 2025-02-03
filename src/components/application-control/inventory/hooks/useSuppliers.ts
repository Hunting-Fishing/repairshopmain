import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { InventorySupplier } from "../types";

export function useSuppliers(organizationId?: string) {
  console.log("useSuppliers - Starting hook with organizationId:", organizationId);

  const { data: suppliers, isLoading, error } = useQuery({
    queryKey: ["inventory-suppliers", organizationId],
    queryFn: async () => {
      if (!organizationId) {
        console.error("useSuppliers - No organizationId provided");
        return [];
      }

      console.log("useSuppliers - Fetching suppliers for org:", organizationId);
      
      const { data, error } = await supabase
        .from("inventory_suppliers")
        .select("*")
        .eq("organization_id", organizationId)
        .order("name")
        .throwOnError();

      if (error) {
        console.error("useSuppliers - Supabase error:", error);
        throw error;
      }

      console.log("useSuppliers - Fetched suppliers:", data);
      return data as InventorySupplier[];
    },
    enabled: !!organizationId,
    // Force a refresh of the data
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0
  });

  return {
    suppliers,
    isLoading,
    error: error as Error | null,
  };
}