
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ChatRoom {
  id: string;
  name: string | null;
  type: string;
  created_at: string;
  created_by: string;
  organization_id: string;
}

export function useChatRooms() {
  return useQuery({
    queryKey: ["chat-rooms"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chat_rooms")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ChatRoom[];
    },
  });
}
