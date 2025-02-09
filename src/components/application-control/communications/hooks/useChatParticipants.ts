
import { supabase } from "@/integrations/supabase/client";

export function useChatParticipants() {
  const addParticipants = async (roomId: string, participantIds: string[]) => {
    const participantsToInsert = participantIds.map(userId => ({
      room_id: roomId,
      user_id: userId,
    }));

    const { error } = await supabase
      .from("chat_participants")
      .insert(participantsToInsert);

    if (error) throw error;
  };

  return { addParticipants };
}
