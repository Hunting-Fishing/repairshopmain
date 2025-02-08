
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { InventoryNotification } from "../types";

export function useInventoryNotifications() {
  const queryClient = useQueryClient();

  const { data: notifications, isLoading, error } = useQuery({
    queryKey: ['inventory-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as InventoryNotification[];
    },
  });

  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('inventory_notifications')
        .update({ 
          status: 'read',
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-notifications'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to mark notification as read: ' + error.message);
    },
  });

  return {
    notifications,
    isLoading,
    error,
    markAsRead,
  };
}
