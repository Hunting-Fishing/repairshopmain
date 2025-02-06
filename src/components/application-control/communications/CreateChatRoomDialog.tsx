
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RoomType } from "./types";
import { useStaffMembers } from "@/hooks/staff/useStaffMembers";
import { BasicInfoSection } from "./forms/BasicInfoSection";
import { RoomTypeSection } from "./forms/RoomTypeSection";
import { ParticipantsSection } from "./forms/ParticipantsSection";
import { RoomSettingsSection } from "./forms/RoomSettingsSection";

export function CreateChatRoomDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<string>("");
  const [roomType, setRoomType] = useState<RoomType>("general");
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [maxParticipants, setMaxParticipants] = useState<string>("");
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const [workOrderId, setWorkOrderId] = useState<string>("");
  const { toast } = useToast();
  const { data: staffMembers } = useStaffMembers();

  const staffOptions = staffMembers?.map(staff => ({
    label: `${staff.first_name} ${staff.last_name}`,
    value: staff.id
  })) || [];

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
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // For direct messages, automatically set the name to the recipient's name
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

      // First create the chat room
      const { data: roomData, error: roomError } = await supabase
        .from("chat_rooms")
        .insert([{ 
          name: chatName, 
          type,
          room_type: roomType,
          category: roomType === 'work_order' ? 'work-order' : 'general',
          is_private: roomType === 'direct' ? true : isPrivate,
          metadata,
          work_order_id: roomType === 'work_order' ? workOrderId : null
        }])
        .select()
        .single();

      if (roomError) {
        throw roomError;
      }

      // Then add the selected participants
      if (selectedStaffIds.length > 0 && roomData) {
        const participantsToInsert = selectedStaffIds.map(staffId => ({
          room_id: roomData.id,
          user_id: staffId,
        }));

        const { error: participantError } = await supabase
          .from("chat_participants")
          .insert(participantsToInsert);

        if (participantError) {
          // If this fails, we should clean up the room we just created
          await supabase.from("chat_rooms").delete().eq("id", roomData.id);
          throw participantError;
        }
      }

      toast({
        title: "Success",
        description: "Chat room created successfully",
      });
      setOpen(false);
      resetForm();
    } catch (error: any) {
      if (error?.message?.includes('direct chat already exists')) {
        toast({
          title: "Error",
          description: "A direct chat already exists with this user in this category",
          variant: "destructive",
        });
      } else {
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

  const resetForm = () => {
    setName("");
    setType("");
    setRoomType("general");
    setDescription("");
    setIsPrivate(false);
    setEnableNotifications(true);
    setMaxParticipants("");
    setSelectedStaffIds([]);
    setWorkOrderId("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          New Chat Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Chat Room</DialogTitle>
          <DialogDescription>
            {roomType === 'direct' 
              ? 'Select a staff member to start a private conversation'
              : 'Create a new chat room for your team to communicate'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {roomType !== 'direct' && (
            <BasicInfoSection
              name={name}
              setName={setName}
              description={description}
              setDescription={setDescription}
            />
          )}

          <RoomTypeSection
            roomType={roomType}
            setRoomType={setRoomType}
            type={type}
            setType={setType}
          />

          <ParticipantsSection
            selectedStaffIds={selectedStaffIds}
            setSelectedStaffIds={setSelectedStaffIds}
            maxParticipants={maxParticipants}
            setMaxParticipants={setMaxParticipants}
            staffOptions={staffOptions}
          />

          {roomType !== 'direct' && (
            <RoomSettingsSection
              isPrivate={isPrivate}
              setIsPrivate={setIsPrivate}
              enableNotifications={enableNotifications}
              setEnableNotifications={setEnableNotifications}
            />
          )}

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => {
              setOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {roomType === 'direct' ? 'Start Conversation' : 'Create Room'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
