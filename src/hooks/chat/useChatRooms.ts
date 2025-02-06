
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChatRoom } from "@/components/application-control/communications/types";

export function useChatRooms(filter?: string) {
  return useQuery({
    queryKey: ["chat-rooms", filter],
    queryFn: async () => {
      let query = supabase
        .from("chat_rooms")
        .select(`
          *,
          sender:created_by(first_name, last_name),
          participants:chat_participants(
            user_id,
            profiles:user_id(first_name, last_name)
          )
        `)
        .order("last_message_at", { ascending: false });

      if (filter) {
        if (filter === 'work-order') {
          query = query.eq("room_type", "work_order");
        } else if (filter === 'direct') {
          query = query.eq("room_type", "direct");
        } else {
          query = query.eq("category", filter);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as ChatRoom[];
    },
  });
}
