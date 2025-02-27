
import { ChatRoom } from "../types";
import { ChatRoomList } from "../ChatRoomList";
import { ChatWindow } from "../ChatWindow";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface ChatTabContentProps {
  selectedRoomId?: string;
  onSelectRoom: (roomId: string) => void;
  filter: "general" | "direct" | "work-order" | "team";
  rooms?: ChatRoom[];
  emptyMessage: string;
}

export function ChatTabContent({
  selectedRoomId,
  onSelectRoom,
  filter,
  rooms,
  emptyMessage,
}: ChatTabContentProps) {
  const selectedRoom = rooms?.find((room) => room.id === selectedRoomId);
  const roomName = selectedRoom?.name || 'Chat Room';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1">
        <ChatRoomList
          selectedRoomId={selectedRoomId}
          onSelectRoom={onSelectRoom}
          filter={filter}
        />
      </div>
      <div className="md:col-span-2">
        {selectedRoomId ? (
          <ChatWindow roomId={selectedRoomId} roomName={roomName} />
        ) : (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              {emptyMessage}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
