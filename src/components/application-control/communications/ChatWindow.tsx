
import { Card, CardContent } from "@/components/ui/card";
import { MessageList } from "./message/MessageList";
import { MessageInput } from "./message/MessageInput";
import { ChatHeader } from "./header/ChatHeader";
import { useChatMessages } from "@/hooks/chat/useChatMessages";
import { useMessageActions } from "@/hooks/chat/useMessageActions";

interface ChatWindowProps {
  roomId: string;
  roomName?: string | null;
}

export function ChatWindow({ roomId, roomName }: ChatWindowProps) {
  const { messages, isLoading } = useChatMessages(roomId);
  const {
    newMessage,
    setNewMessage,
    isUploading,
    handleSendMessage,
    handleFileUpload
  } = useMessageActions();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="h-[calc(100vh-300px)] flex flex-col">
      <ChatHeader roomName={roomName} />
      <CardContent className="flex-1 flex flex-col p-0">
        <MessageList messages={messages} />
        <MessageInput
          newMessage={newMessage}
          onMessageChange={setNewMessage}
          onSendMessage={(e) => handleSendMessage(e, roomId)}
          onFileUpload={(e) => handleFileUpload(e, roomId)}
          isUploading={isUploading}
        />
      </CardContent>
    </Card>
  );
}
