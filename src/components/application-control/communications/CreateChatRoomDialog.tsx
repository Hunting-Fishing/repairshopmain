
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useStaffMembers } from "@/hooks/staff/useStaffMembers";
import { RoomType } from "./types";
import { ChatRoomFormProvider } from "./forms/ChatRoomFormContext";
import { ChatRoomFormContent } from "./forms/ChatRoomFormContent";
import { useChatRoomSubmit } from "./forms/useChatRoomSubmit";

export function CreateChatRoomDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<string>("");
  const [roomType, setRoomType] = useState<RoomType>("general");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [maxParticipants, setMaxParticipants] = useState<string>("");
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const [workOrderId, setWorkOrderId] = useState<string>("");
  
  const { data: staffMembers } = useStaffMembers();

  const staffOptions = staffMembers?.map(staff => ({
    label: `${staff.first_name} ${staff.last_name}`,
    value: staff.id
  })) || [];

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

  const { isLoading, handleSubmit } = useChatRoomSubmit({
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
    onSuccess: () => {
      setOpen(false);
      resetForm();
    }
  });

  const handleCancel = () => {
    setOpen(false);
    resetForm();
  };

  const formContext = {
    name,
    setName,
    type,
    setType,
    roomType,
    setRoomType,
    description,
    setDescription,
    isPrivate,
    setIsPrivate,
    enableNotifications,
    setEnableNotifications,
    maxParticipants,
    setMaxParticipants,
    selectedStaffIds,
    setSelectedStaffIds,
    workOrderId,
    setWorkOrderId,
    isLoading
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

        <ChatRoomFormProvider value={formContext}>
          <ChatRoomFormContent
            onCancel={handleCancel}
            staffOptions={staffOptions}
            onSubmit={handleSubmit}
          />
        </ChatRoomFormProvider>
      </DialogContent>
    </Dialog>
  );
}
