
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { StaffMember } from "@/types/staff";
import { useAuth } from "@/contexts/AuthContext";

interface UseChatRoomSubmitProps {
  name: string;
  type: string;
  roomType: string;
  description: string;
  isPrivate: boolean;
  enableNotifications: boolean;
  maxParticipants: string;
  selectedStaffIds: string[];
  workOrderId: string;
  staffMembers?: StaffMember[];
  onSuccess: () => void;
}

export function useChatRoomSubmit({
  name,
  type,
  roomType,
  description,
  isPrivate,
  enableNotifications,
  maxParticipants,
  selectedStaffIds,
  workOrderId,
  staffMembers,
  onSuccess
}: UseChatRoomSubmitProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const validateForm = () => {
    if (roomType === 'direct' && selectedStaffIds.length !== 1) {
      toast({
        title: "Validation Error",
        description: "Direct messages must have exactly one participant selected",
        variant: "destructive",
      });
      return false;
    }

    if (roomType === 'work_order' && !workOrderId) {
      toast({
        title: "Validation Error",
        description: "Work order chats must be connected to a work order",
        variant: "destructive",
      });
      return false;
    }

    if (roomType !== 'direct' && !name.trim()) {
      toast({
        title: "Validation Error",
        description: "Chat room name is required",
        variant: "destructive",
      });
      return false;
    }

    if (!type) {
      toast({
        title: "Validation Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) {
      return;
    }

    setIsLoading(true);

    try {
      // First get the organization_id for the current user
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;
      if (!profileData?.organization_id) {
        throw new Error("User organization not found");
      }

      let chatName = name;
      let chatDescription = description;
      if (roomType === 'direct' && selectedStaffIds.length === 1) {
        const recipient = staffMembers?.find(staff => staff.id === selectedStaffIds[0]);
        if (recipient) {
          chatName = `Chat with ${recipient.first_name} ${recipient.last_name}`;
          chatDescription = `Direct message conversation`;
        }
      }

      const metadata = {
        description: chatDescription,
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
        enableNotifications,
        workOrderId: roomType === 'work_order' ? workOrderId : null,
      };

      const { data: roomData, error: roomError } = await supabase
        .from("chat_rooms")
        .insert([{ 
          name: chatName, 
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

      if (roomError) {
        throw roomError;
      }

      if (roomData) {
        // Create array of participants including the current user
        const participantsToInsert = [
          { room_id: roomData.id, user_id: user.id },
          ...selectedStaffIds.map(staffId => ({
            room_id: roomData.id,
            user_id: staffId,
          }))
        ];

        const { error: participantError } = await supabase
          .from("chat_participants")
          .insert(participantsToInsert);

        if (participantError) {
          await supabase.from("chat_rooms").delete().eq("id", roomData.id);
          throw participantError;
        }
      }

      toast({
        title: "Success",
        description: "Chat room created successfully",
      });
      onSuccess();
    } catch (error: any) {
      if (error?.message?.includes('direct chat already exists')) {
        toast({
          title: "Error",
          description: "A direct chat already exists with this user in this category",
          variant: "destructive",
        });
      } else {
        console.error("Error creating chat room:", error);
        toast({
          title: "Error",
          description: "Failed to create chat room",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSubmit
  };
}
