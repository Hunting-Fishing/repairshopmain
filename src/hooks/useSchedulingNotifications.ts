
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SchedulingNotification } from "@/types/bookings";
import { toast } from "sonner";

export function useSchedulingNotifications(recipientId: string) {
  return useQuery({
    queryKey: ['scheduling-notifications', recipientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scheduling_notifications')
        .select('*')
        .eq('recipient_id', recipientId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        toast.error('Failed to fetch notifications');
        throw error;
      }

      return data as SchedulingNotification[];
    },
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60 // Refetch every minute
  });
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const { error } = await supabase
      .from('scheduling_notifications')
      .update({ status: 'read', sent_at: new Date().toISOString() })
      .eq('id', notificationId);

    if (error) throw error;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    toast.error('Failed to update notification');
  }
}
