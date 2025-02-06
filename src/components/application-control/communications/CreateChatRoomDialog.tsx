
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
  const { toast } = useToast();
  const { data: staffMembers } = useStaffMembers();

  const staffOptions = staffMembers?.map(staff => ({
    label: `${staff.first_name} ${staff.last_name}`,
    value: staff.id
  })) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const metadata = {
        description,
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
        enableNotifications,
      };

      // First create the chat room
      const { data: roomData, error: roomError } = await supabase
        .from("chat_rooms")
        .insert([{ 
          name, 
          type,
          room_type: roomType,
          category: roomType === 'work_order' ? 'work-order' : 'general',
          is_private: isPrivate,
          metadata
        }])
        .select()
        .single();

      if (roomError) throw roomError;

      // Then add the selected participants
      if (selectedStaffIds.length > 0 && roomData) {
        const participantsToInsert = selectedStaffIds.map(staffId => ({
          room_id: roomData.id,
          user_id: staffId,
        }));

        const { error: participantError } = await supabase
          .from("chat_participants")
          .insert(participantsToInsert);

        if (participantError) throw participantError;
      }

      toast({
        title: "Success",
        description: "Chat room created successfully",
      });
      setOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create chat room",
        variant: "destructive",
      });
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
            Create a new chat room for your team to communicate
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <BasicInfoSection
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
          />

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

          <RoomSettingsSection
            isPrivate={isPrivate}
            setIsPrivate={setIsPrivate}
            enableNotifications={enableNotifications}
            setEnableNotifications={setEnableNotifications}
          />

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => {
              setOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              Create Room
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
