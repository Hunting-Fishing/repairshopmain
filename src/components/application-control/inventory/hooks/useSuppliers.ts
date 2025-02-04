import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { InventorySupplier } from "../types";

export function useSuppliers(organizationId?: string) {
  console.log("useSuppliers - Starting hook with organizationId:", organizationId);

  const { data: suppliers, isLoading, error, refetch } = useQuery({
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
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!organizationId) return;

    const channel = supabase
      .channel('supplier-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory_suppliers',
          filter: `organization_id=eq.${organizationId}`
        },
        (payload) => {
          console.log("Real-time supplier update:", payload);
          toast.info("Supplier data updated");
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [organizationId, refetch]);

  return {
    suppliers,
    isLoading,
    error: error as Error | null,
  };
}