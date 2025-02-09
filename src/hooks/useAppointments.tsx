
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UseAppointmentsProps {
  searchQuery?: string;
  currentPage: number;
  itemsPerPage: number;
  sortField: string;
  sortDirection: 'asc' | 'desc';
}

export function useAppointments({
  searchQuery,
  currentPage,
  itemsPerPage,
  sortField,
  sortDirection
}: UseAppointmentsProps) {
  return useQuery({
    queryKey: ["appointments", searchQuery, currentPage, itemsPerPage, sortField, sortDirection],
    queryFn: async () => {
      const query = supabase
        .from("bookings")
        .select("*, profiles(first_name, last_name)")
        .order(sortField, { ascending: sortDirection === "asc" })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

      if (searchQuery) {
        query.textSearch("customer_name", searchQuery);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}
