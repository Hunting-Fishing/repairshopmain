
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { BookingFormValues } from "@/types/bookings";

interface NotificationPreferencesProps {
  form: UseFormReturn<BookingFormValues>;
}

export function NotificationPreferences({ form }: NotificationPreferencesProps) {
  return (
    <div className="space-y-3">
      <FormLabel>Notification Preferences</FormLabel>
      <div className="flex flex-col gap-2">
        <FormField
          control={form.control}
          name="notificationPreferences.email"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Email Notifications</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notificationPreferences.sms"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>SMS Notifications</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
