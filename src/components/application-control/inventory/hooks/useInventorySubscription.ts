import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';

export function useInventorySubscription(
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult>
) {
  useEffect(() => {
    const channel = supabase
      .channel('inventory-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory_items'
        },
        async (payload) => {
          // Show toast notification based on the event
          if (payload.eventType === 'INSERT') {
            toast.success('New inventory item added');
          } else if (payload.eventType === 'UPDATE') {
            toast.info('Inventory item updated');
          } else if (payload.eventType === 'DELETE') {
            toast.warning('Inventory item removed');
          }
          // Refetch the data to update the UI
          await refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);
}