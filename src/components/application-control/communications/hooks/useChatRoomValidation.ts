
import { useToast } from "@/hooks/use-toast";
import type { StaffMember } from "@/types/staff";

interface ValidationProps {
  roomType: string;
  selectedStaffIds: string[];
  workOrderId: string;
  name: string;
  type: string;
}

export function useChatRoomValidation() {
  const { toast } = useToast();

  const validateChatRoom = ({
    roomType,
    selectedStaffIds,
    workOrderId,
    name,
    type
  }: ValidationProps) => {
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

  return { validateChatRoom };
}
