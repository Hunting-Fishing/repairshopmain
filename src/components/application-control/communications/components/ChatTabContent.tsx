
import { Card, CardContent } from "@/components/ui/card";
import { ChatRoomList } from "../ChatRoomList";
import { ChatWindow } from "../ChatWindow";
import { ChatRoom } from "../types";

interface ChatTabContentProps {
  selectedRoomId?: string;
  onSelectRoom: (id: string) => void;
  filter?: string;
  rooms?: ChatRoom[];
  emptyMessage: string;
}

export function ChatTabContent({
  selectedRoomId,
  onSelectRoom,
  filter,
  rooms,
  emptyMessage
}: ChatTabContentProps) {
  const selectedRoom = rooms?.find(room => room.id === selectedRoomId);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <ChatRoomList 
              selectedRoomId={selectedRoomId} 
              onSelectRoom={onSelectRoom}
              filter={filter}
            />
          </div>
          <div className="lg:col-span-9">
            {selectedRoomId ? (
              <ChatWindow roomId={selectedRoomId} roomName={selectedRoom?.name} />
            ) : (
              <div className="text-muted-foreground">{emptyMessage}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
