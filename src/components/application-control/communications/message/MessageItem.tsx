
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MessageItemProps {
  content: string;
  sender?: {
    first_name?: string;
    last_name?: string;
  };
  created_at: string;
}

export function MessageItem({ content, sender, created_at }: MessageItemProps) {
  return (
    <div className="bg-muted p-3 rounded-lg">
      <div className="flex items-center gap-2 mb-1">
        <Avatar className="h-6 w-6">
          <AvatarFallback>
            {sender?.first_name?.[0]}
            {sender?.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium">
          {sender?.first_name} {sender?.last_name}
        </span>
        <span className="text-xs text-muted-foreground">
          {new Date(created_at).toLocaleString()}
        </span>
      </div>
      <p>{content}</p>
    </div>
  );
}
