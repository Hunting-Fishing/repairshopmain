
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

export function ChatRoomList({ selectedRoomId, onSelectRoom }: { 
  selectedRoomId?: string;
  onSelectRoom: (roomId: string) => void;
}) {
  const { data: rooms, isLoading } = useChatRooms();

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
                <CardTitle className="text-base">{room.name || "Unnamed Chat"}</CardTitle>
                <CardDescription>{room.type}</CardDescription>
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
