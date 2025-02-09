
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useChatRoomValidation } from "./useChatRoomValidation";
import { useChatParticipants } from "./useChatParticipants";

interface UseChatRoomProps {
  name: string;
  type: string;
  roomType: string;
  description: string;
  isPrivate: boolean;
  enableNotifications: boolean;
  maxParticipants: string;
  selectedStaffIds: string[];
  workOrderId: string;
  onSuccess: () => void;
}

export function useChatRoom({
  name,
  type,
  roomType,
  description,
  isPrivate,
  enableNotifications,
  maxParticipants,
  selectedStaffIds,
  workOrderId,
  onSuccess
}: UseChatRoomProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { validateChatRoom } = useChatRoomValidation();
  const { addParticipants } = useChatParticipants();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateChatRoom({ roomType, selectedStaffIds, workOrderId, name, type })) {
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;
      if (!profileData?.organization_id) throw new Error("Organization not found");

      const metadata = {
        description,
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
        enableNotifications,
        workOrderId: roomType === 'work_order' ? workOrderId : null,
      };

      const { data: roomData, error: roomError } = await supabase
        .from("chat_rooms")
        .insert([{ 
          name,
          type,
          room_type: roomType,
          category: roomType === 'work_order' ? 'work-order' : 'general',
          is_private: roomType === 'direct' ? true : isPrivate,
          metadata,
          work_order_id: roomType === 'work_order' ? workOrderId : null,
          organization_id: profileData.organization_id,
          created_by: user.id
        }])
        .select()
        .single();

      if (roomError) throw roomError;

      if (roomData) {
        await addParticipants(roomData.id, [user.id, ...selectedStaffIds]);
      }

      toast({
        title: "Success",
        description: "Chat room created successfully",
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleSubmit };
}
