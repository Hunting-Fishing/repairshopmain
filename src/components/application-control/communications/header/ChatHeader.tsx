
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

interface ChatHeaderProps {
  roomName: string | null | undefined;
}

export function ChatHeader({ roomName }: ChatHeaderProps) {
  return (
    <CardHeader className="border-b">
      <div className="flex justify-between items-center">
        <CardTitle>{roomName || "Chat Room"}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Share Chat</DropdownMenuItem>
            <DropdownMenuItem>Search Messages</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardHeader>
  );
}
