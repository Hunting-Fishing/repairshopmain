
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChatRooms } from "@/hooks/chat/useChatRooms";
import { ChatSettings } from "./ChatSettings";
import { CommunicationsHeader } from "./components/CommunicationsHeader";
import { ChatTabContent } from "./components/ChatTabContent";
import { useCommunicationTabs } from "./hooks/useCommunicationTabs";

export function CommunicationsTab() {
  const { selectedRoomId, setSelectedRoomId, showSettings, setShowSettings } = useCommunicationTabs();
  const { data: rooms } = useChatRooms();

  return (
    <div className="space-y-6">
      <CommunicationsHeader onOpenSettings={() => setShowSettings(true)} />

      <Tabs defaultValue="chats" className="w-full">
        <TabsList>
          <TabsTrigger value="chats">Active Chats</TabsTrigger>
          <TabsTrigger value="direct">Direct Messages</TabsTrigger>
          <TabsTrigger value="work-orders">Work Order Discussions</TabsTrigger>
          <TabsTrigger value="team">Team Channels</TabsTrigger>
        </TabsList>

        <TabsContent value="direct" className="mt-6">
          <ChatTabContent
            selectedRoomId={selectedRoomId}
            onSelectRoom={setSelectedRoomId}
            filter="direct"
            rooms={rooms}
            emptyMessage="Select a conversation to start messaging"
          />
        </TabsContent>

        <TabsContent value="chats" className="mt-6">
          <ChatTabContent
            selectedRoomId={selectedRoomId}
            onSelectRoom={setSelectedRoomId}
            filter="general"
            rooms={rooms}
            emptyMessage="Select a chat room to start messaging"
          />
        </TabsContent>

        <TabsContent value="work-orders" className="mt-6">
          <ChatTabContent
            selectedRoomId={selectedRoomId}
            onSelectRoom={setSelectedRoomId}
            filter="work-order"
            rooms={rooms}
            emptyMessage="Select a work order discussion to view messages"
          />
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <ChatTabContent
            selectedRoomId={selectedRoomId}
            onSelectRoom={setSelectedRoomId}
            filter="team"
            rooms={rooms}
            emptyMessage="Select a team channel to start messaging"
          />
        </TabsContent>
      </Tabs>

      <ChatSettings open={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
