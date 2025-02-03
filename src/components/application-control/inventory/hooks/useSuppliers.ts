import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { InventorySupplier } from "../types";

export function useSuppliers(organizationId?: string) {
  console.log("useSuppliers - organizationId:", organizationId); // Debug log

  const { data: suppliers, isLoading: suppliersLoading, error } = useQuery({
    queryKey: ["inventory-suppliers", organizationId],
    queryFn: async () => {
      console.log("useSuppliers - Fetching suppliers for org:", organizationId); // Debug log
      
      const { data, error } = await supabase
        .from("inventory_suppliers")
        .select("*")
        .eq("organization_id", organizationId)
        .order("name");

      if (error) {
        console.error("useSuppliers - Supabase error:", error); // Error log
        throw error;
      }

      console.log("useSuppliers - Fetched suppliers:", data); // Debug log
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