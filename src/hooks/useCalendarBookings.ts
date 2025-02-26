
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";
import { queryKeys } from "./useQueryKeys";
import type { Booking } from "@/types/calendar";
import { useEffect } from "react";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export function useCalendarBookings(selectedDate: Date) {
  const queryClient = useQueryClient();

  const result = useQuery({
    queryKey: queryKeys.bookings.byDate(format(selectedDate, "yyyy-MM-dd")),
    queryFn: async () => {
      try {
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .gte('start_time', startOfDay.toISOString())
          .lte('start_time', endOfDay.toISOString())
          .order("start_time");

        if (error) {
          console.error("Error fetching bookings:", error);
          toast.error("Error fetching bookings");
          throw error;
        }

        return data as Booking[];
      } catch (error) {
        console.error("Calendar query error:", error);
        toast.error("Failed to load calendar data");
        throw error;
      }
    },
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 2,
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
        (payload: RealtimePostgresChangesPayload<Booking>) => {
          // Ensure payload.new exists before accessing it
          if (payload.new && 'start_time' in payload.new) {
            const date = format(new Date(payload.new.start_time), "yyyy-MM-dd");
            queryClient.invalidateQueries({ 
              queryKey: queryKeys.bookings.byDate(date)
            });
            
            // Show appropriate toast based on the event type
            switch (payload.eventType) {
              case 'INSERT':
                toast.success('New booking added');
                break;
              case 'UPDATE':
                toast.success('Booking updated');
                break;
              case 'DELETE':
                toast.info('Booking removed');
                break;
            }
          } else {
            // If no new data, invalidate the current selected date
            queryClient.invalidateQueries({ 
              queryKey: queryKeys.bookings.byDate(format(selectedDate, "yyyy-MM-dd"))
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedDate, queryClient]);

  return result;
}
