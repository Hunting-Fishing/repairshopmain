
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send } from "lucide-react";
import { useRef } from "react";

interface MessageInputProps {
  newMessage: string;
  onMessageChange: (message: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function MessageInput({ 
  newMessage, 
  onMessageChange, 
  onSendMessage, 
  onFileUpload 
}: MessageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <form onSubmit={onSendMessage} className="p-4 border-t flex gap-2">
      <Input
        value={newMessage}
        onChange={(e) => onMessageChange(e.target.value)}
        placeholder="Type your message..."
        className="flex-1"
      />
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={onFileUpload}
      />
      <Button 
        type="button" 
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
      >
        <Paperclip className="h-4 w-4" />
      </Button>
      <Button type="submit">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
