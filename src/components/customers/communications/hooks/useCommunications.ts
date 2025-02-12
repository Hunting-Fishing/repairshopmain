
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Communication, CommunicationsFilter, CommunicationSort } from "../types";

interface UseCommunicationsProps {
  customerId: string;
  filter?: CommunicationsFilter;
  sort?: CommunicationSort;
  page?: number;
  pageSize?: number;
}

export function useCommunications({ 
  customerId,
  filter,
  sort = { field: 'sent_at', direction: 'desc' },
  page = 1,
  pageSize = 10
}: UseCommunicationsProps) {
  return useQuery({
    queryKey: ["communications", customerId, filter, sort, page, pageSize],
    queryFn: async () => {
      let query = supabase
        .from("unified_communications")
        .select(`
          *,
          sender:profiles(first_name, last_name)
        `)
        .eq("customer_id", customerId);

      // Apply filters
      if (filter?.type) {
        query = query.eq("type", filter.type);
      }
      if (filter?.status) {
        query = query.eq("status", filter.status);
      }
      if (filter?.dateRange) {
        query = query
          .gte("sent_at", filter.dateRange.from.toISOString())
          .lte("sent_at", filter.dateRange.to.toISOString());
      }

      // Apply sorting
      query = query.order(sort.field, { ascending: sort.direction === 'asc' });

      // Apply pagination
      query = query
        .range((page - 1) * pageSize, page * pageSize - 1);

      const { data, error, count } = await query.select('*', { count: 'exact' });

      if (error) throw error;

      return {
        communications: data as Communication[],
        total: count ?? 0,
        pageCount: Math.ceil((count ?? 0) / pageSize)
      };
    },
  });
}
