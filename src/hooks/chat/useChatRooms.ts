
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ChatRoom {
  id: string;
  name: string | null;
  type: string;
  category: string;
  created_at: string;
  created_by: string;
  organization_id: string;
  is_private: boolean;
  metadata: any;
  last_message_at: string;
}

export function useChatRooms(filter?: string) {
  return useQuery({
    queryKey: ["chat-rooms", filter],
    queryFn: async () => {
      let query = supabase
        .from("chat_rooms")
        .select("*")
        .order("last_message_at", { ascending: false });

      if (filter) {
        query = query.eq("category", filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as ChatRoom[];
    },
  });
}
