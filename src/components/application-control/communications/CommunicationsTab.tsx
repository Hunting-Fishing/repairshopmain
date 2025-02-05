
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatRoomList } from "./ChatRoomList";

export function CommunicationsTab() {
  const [selectedRoomId, setSelectedRoomId] = useState<string>();

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
              <div>Chat window will go here</div>
            ) : (
              <div className="text-muted-foreground">Select a chat room to start messaging</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
