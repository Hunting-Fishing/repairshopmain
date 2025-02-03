import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";
import { queryKeys } from "./useQueryKeys";
import type { Booking } from "@/types/calendar";

export function useCalendarBookings(selectedDate: Date) {
  const queryClient = useQueryClient();

  const result = useQuery({
    queryKey: queryKeys.bookings.byDate(format(selectedDate, "yyyy-MM-dd")),
    queryFn: async () => {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .gte("start_time", startOfDay.toISOString())
        .lte("start_time", endOfDay.toISOString())
        .order("start_time");

      if (error) {
        toast.error("Error fetching bookings");
        throw error;
      }

      return data as Booking[];
    },
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    cacheTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });

  // Set up real-time subscription for booking updates
  useEffect(() => {
    const channel = supabase
      .channel('booking-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          // Invalidate the specific day's query when bookings change
          const date = payload.new?.start_time 
            ? format(new Date(payload.new.start_time), "yyyy-MM-dd")
            : format(selectedDate, "yyyy-MM-dd");
            
          queryClient.invalidateQueries({ 
            queryKey: queryKeys.bookings.byDate(date)
          });
          toast.info("Bookings updated");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedDate, queryClient]);

  return result;
}