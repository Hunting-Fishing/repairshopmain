
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Lock, Bell } from "lucide-react";
import { useChatRoomForm } from "./ChatRoomFormContext";

export function RoomSettingsSection() {
  const {
    isPrivate,
    setIsPrivate,
    enableNotifications,
    setEnableNotifications
  } = useChatRoomForm();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Lock className="h-4 w-4" />
        <Label htmlFor="private">Private Room</Label>
        <Switch
          id="private"
          checked={isPrivate}
          onCheckedChange={setIsPrivate}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Bell className="h-4 w-4" />
        <Label htmlFor="notifications">Notifications</Label>
        <Switch
          id="notifications"
          checked={enableNotifications}
          onCheckedChange={setEnableNotifications}
        />
      </div>
    </div>
  );
}
