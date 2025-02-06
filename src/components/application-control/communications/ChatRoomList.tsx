
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useChatRooms } from "@/hooks/chat/useChatRooms";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { CreateChatRoomDialog } from "./CreateChatRoomDialog";
import { useAuth } from "@/contexts/AuthContext";

interface ChatRoomListProps {
  selectedRoomId?: string;
  onSelectRoom: (roomId: string) => void;
  filter?: string;
}

export function ChatRoomList({ selectedRoomId, onSelectRoom, filter }: ChatRoomListProps) {
  const { data: rooms, isLoading } = useChatRooms(filter);
  const { user } = useAuth();

  const formatRoomName = (room: any) => {
    if (room.room_type === 'direct') {
      // Get the other participant's name
      const otherParticipant = room.participants?.find(
        (p: any) => p.user_id !== user?.id
      );
      return otherParticipant 
        ? `Chat with ${otherParticipant.first_name} ${otherParticipant.last_name}`
        : room.name || "Direct Message";
    }

    if (room.room_type === 'work_order') {
      return `Work Order: ${room.name || 'Untitled'}`;
    }

    if (room.room_type === 'group') {
      return `Group: ${room.name || 'Untitled Group'}`;
    }

    return room.name || "General Chat";
  };

  if (isLoading) {
    return <div className="space-y-2">
      <div className="h-20 rounded-lg bg-muted animate-pulse" />
      <div className="h-20 rounded-lg bg-muted animate-pulse" />
      <div className="h-20 rounded-lg bg-muted animate-pulse" />
    </div>;
  }

  return (
    <div className="space-y-4">
      <CreateChatRoomDialog />
      
      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-2 pr-4">
          {rooms?.map((room) => (
            <Card 
              key={room.id}
              className={cn(
                "cursor-pointer transition-colors hover:bg-accent",
                selectedRoomId === room.id && "bg-accent"
              )}
              onClick={() => onSelectRoom(room.id)}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-base">{formatRoomName(room)}</CardTitle>
                <CardDescription>
                  {room.type} {room.room_type !== 'direct' && '• ' + room.room_type}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}

          {rooms?.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No chat rooms yet
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
