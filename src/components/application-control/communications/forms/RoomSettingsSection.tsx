
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Lock, Bell } from "lucide-react";

interface RoomSettingsSectionProps {
  isPrivate: boolean;
  setIsPrivate: (value: boolean) => void;
  enableNotifications: boolean;
  setEnableNotifications: (value: boolean) => void;
}

export function RoomSettingsSection({
  isPrivate,
  setIsPrivate,
  enableNotifications,
  setEnableNotifications,
}: RoomSettingsSectionProps) {
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
