
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface ChatSettingsProps {
  open: boolean;
  onClose: () => void;
}

export function ChatSettings({ open, onClose }: ChatSettingsProps) {
  const [notifyNewMessages, setNotifyNewMessages] = useState(true);
  const [notifyMentions, setNotifyMentions] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chat Settings</DialogTitle>
          <DialogDescription>
            Configure your chat notifications and preferences
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="notify-messages">Notify for new messages</Label>
            <Switch
              id="notify-messages"
              checked={notifyNewMessages}
              onCheckedChange={setNotifyNewMessages}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="notify-mentions">Notify when mentioned</Label>
            <Switch
              id="notify-mentions"
              checked={notifyMentions}
              onCheckedChange={setNotifyMentions}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sound-enabled">Message sound effects</Label>
            <Switch
              id="sound-enabled"
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
