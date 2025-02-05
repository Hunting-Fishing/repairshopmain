
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatRoomList } from "./ChatRoomList";
import { ChatWindow } from "./ChatWindow";
import { useChatRooms } from "@/hooks/chat/useChatRooms";

export function CommunicationsTab() {
  const [selectedRoomId, setSelectedRoomId] = useState<string>();
  const { data: rooms } = useChatRooms();

  const selectedRoom = rooms?.find(room => room.id === selectedRoomId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Communications</CardTitle>
        <CardDescription>Manage chat rooms and communication settings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <ChatRoomList 
              selectedRoomId={selectedRoomId} 
              onSelectRoom={setSelectedRoomId} 
            />
          </div>
          <div className="lg:col-span-9">
            {selectedRoomId ? (
              <ChatWindow roomId={selectedRoomId} roomName={selectedRoom?.name} />
            ) : (
              <div className="text-muted-foreground">Select a chat room to start messaging</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
