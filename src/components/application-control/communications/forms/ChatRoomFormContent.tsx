
import { BasicInfoSection } from "./BasicInfoSection";
import { RoomTypeSection } from "./RoomTypeSection";
import { ParticipantsSection } from "./ParticipantsSection";
import { RoomSettingsSection } from "./RoomSettingsSection";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useChatRoomForm } from "./ChatRoomFormContext";

interface ChatRoomFormContentProps {
  onCancel: () => void;
  staffOptions: { label: string; value: string }[];
  onSubmit: (e: React.FormEvent) => void;
}

export function ChatRoomFormContent({ onCancel, staffOptions, onSubmit }: ChatRoomFormContentProps) {
  const { roomType, isLoading } = useChatRoomForm();

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {roomType !== 'direct' && <BasicInfoSection />}

      <RoomTypeSection />

      <ParticipantsSection staffOptions={staffOptions} />

      {roomType !== 'direct' && <RoomSettingsSection />}

      <DialogFooter>
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {roomType === 'direct' ? 'Start Conversation' : 'Create Room'}
        </Button>
      </DialogFooter>
    </form>
  );
}
