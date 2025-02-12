
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface NotificationSettingsProps {
  notificationSettings: {
    notify_on_send: boolean;
    notify_on_error: boolean;
  };
  setNotificationSettings: (settings: {
    notify_on_send: boolean;
    notify_on_error: boolean;
  }) => void;
}

export function NotificationSettings({
  notificationSettings,
  setNotificationSettings,
}: NotificationSettingsProps) {
  return (
    <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
      <h3 className="font-medium text-sm">Notification Settings</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notify_on_send">Notify on Send</Label>
            <p className="text-sm text-gray-500">
              Receive notifications when this template is sent
            </p>
          </div>
          <Switch
            id="notify_on_send"
            checked={notificationSettings.notify_on_send}
            onCheckedChange={(checked) =>
              setNotificationSettings({
                ...notificationSettings,
                notify_on_send: checked,
              })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notify_on_error">Notify on Error</Label>
            <p className="text-sm text-gray-500">
              Receive notifications when sending fails
            </p>
          </div>
          <Switch
            id="notify_on_error"
            checked={notificationSettings.notify_on_error}
            onCheckedChange={(checked) =>
              setNotificationSettings({
                ...notificationSettings,
                notify_on_error: checked,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
