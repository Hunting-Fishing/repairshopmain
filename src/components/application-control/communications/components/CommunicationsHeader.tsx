
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateChatRoomDialog } from "../CreateChatRoomDialog";

interface CommunicationsHeaderProps {
  onOpenSettings: () => void;
}

export function CommunicationsHeader({ onOpenSettings }: CommunicationsHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Communications</h2>
        <p className="text-muted-foreground">
          Manage team communications and work order discussions
        </p>
      </div>
      <div className="flex gap-2">
        <CreateChatRoomDialog />
        <Button variant="outline" onClick={onOpenSettings}>
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
