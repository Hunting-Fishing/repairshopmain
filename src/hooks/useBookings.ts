
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookingQueryResult } from "@/types/bookings";
import { toast } from "sonner";

export function useBookings() {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          technician:assigned_technician_id(
            id,
            first_name,
            last_name
          )
        `)
        .order("start_time", { ascending: true });

      if (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to load bookings");
        throw error;
      }

      return data as BookingQueryResult[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
