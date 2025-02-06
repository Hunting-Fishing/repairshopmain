
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Paperclip, Send } from "lucide-react";
import { useRef } from "react";

interface MessageInputProps {
  newMessage: string;
  onMessageChange: (message: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading?: boolean;
}

export function MessageInput({ 
  newMessage, 
  onMessageChange, 
  onSendMessage, 
  onFileUpload,
  isUploading = false
}: MessageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <form onSubmit={onSendMessage} className="p-4 border-t flex gap-2">
      <Input
        value={newMessage}
        onChange={(e) => onMessageChange(e.target.value)}
        placeholder="Type your message..."
        className="flex-1"
        disabled={isUploading}
      />
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={onFileUpload}
        disabled={isUploading}
      />
      <Button 
        type="button" 
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Paperclip className="h-4 w-4" />
        )}
      </Button>
      <Button type="submit" disabled={isUploading}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
