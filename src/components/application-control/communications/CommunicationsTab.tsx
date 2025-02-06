
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChatRoomList } from "./ChatRoomList";
import { ChatWindow } from "./ChatWindow";
import { useChatRooms } from "@/hooks/chat/useChatRooms";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import { CreateChatRoomDialog } from "./CreateChatRoomDialog";
import { ChatSettings } from "./ChatSettings";

export function CommunicationsTab() {
  const [selectedRoomId, setSelectedRoomId] = useState<string>();
  const [showSettings, setShowSettings] = useState(false);
  const { data: rooms } = useChatRooms();

  const selectedRoom = rooms?.find(room => room.id === selectedRoomId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Communications</h2>
          <p className="text-muted-foreground">
            Manage team communications and work order discussions
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => {}}>
            <Plus className="h-4 w-4 mr-2" />
            New Chat Room
          </Button>
          <Button variant="outline" onClick={() => setShowSettings(true)}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="chats" className="w-full">
        <TabsList>
          <TabsTrigger value="chats">Active Chats</TabsTrigger>
          <TabsTrigger value="work-orders">Work Order Discussions</TabsTrigger>
          <TabsTrigger value="team">Team Channels</TabsTrigger>
        </TabsList>

        <TabsContent value="chats" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-3 space-y-4">
                  <ChatRoomList 
                    selectedRoomId={selectedRoomId} 
                    onSelectRoom={setSelectedRoomId}
                    filter="general"
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
        </TabsContent>

        <TabsContent value="work-orders" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-3 space-y-4">
                  <ChatRoomList 
                    selectedRoomId={selectedRoomId} 
                    onSelectRoom={setSelectedRoomId}
                    filter="work-order"
                  />
                </div>
                <div className="lg:col-span-9">
                  {selectedRoomId ? (
                    <ChatWindow roomId={selectedRoomId} roomName={selectedRoom?.name} />
                  ) : (
                    <div className="text-muted-foreground">Select a work order discussion to view messages</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-3 space-y-4">
                  <ChatRoomList 
                    selectedRoomId={selectedRoomId} 
                    onSelectRoom={setSelectedRoomId}
                    filter="team"
                  />
                </div>
                <div className="lg:col-span-9">
                  {selectedRoomId ? (
                    <ChatWindow roomId={selectedRoomId} roomName={selectedRoom?.name} />
                  ) : (
                    <div className="text-muted-foreground">Select a team channel to start messaging</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ChatSettings open={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
