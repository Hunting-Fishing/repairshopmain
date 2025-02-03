import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useInventoryHistory() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("inventory-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "inventory_history",
        },
        async (payload) => {
          // Show toast notification based on the event
          if (payload.eventType === "INSERT") {
            const newRecord = payload.new as any;
            toast.info(`Inventory change recorded: ${newRecord.change_type}`);
          }
          
          // Refetch the history data
          await queryClient.invalidateQueries({ queryKey: ["inventory-history"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}