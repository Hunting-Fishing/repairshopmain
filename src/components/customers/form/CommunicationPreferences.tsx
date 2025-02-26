
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../types/customerTypes";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface CommunicationPreferencesProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
}

export function CommunicationPreferences({ form, isModernTheme = false }: CommunicationPreferencesProps) {
  const handleChannelChange = (channel: keyof CustomerFormValues['marketing_preferences'], value: boolean) => {
    form.setValue(`marketing_preferences.${channel}`, value);
    toast.success(`${channel.charAt(0).toUpperCase() + channel.slice(1)} preferences updated`);
  };

  return (
    <Card className={isModernTheme ? "border-orange-200/50" : ""}>
      <CardHeader>
        <CardTitle>Communication Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Channel Preferences */}
        <div className="space-y-4">
          <h4 className="font-medium">Channel Preferences</h4>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="marketing_preferences.email"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Email Communications</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(value) => handleChannelChange('email', value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="marketing_preferences.sms"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>SMS Communications</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(value) => handleChannelChange('sms', value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="marketing_preferences.phone"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Phone Communications</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(value) => handleChannelChange('phone', value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Preferred Contact Time */}
        <div className="space-y-4">
          <h4 className="font-medium">Contact Time Preferences</h4>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="preferred_contact_time.start"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Start Time</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select start time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 24 }).map((_, i) => (
                        <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                          {`${i.toString().padStart(2, '0')}:00`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preferred_contact_time.end"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred End Time</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select end time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 24 }).map((_, i) => (
                        <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                          {`${i.toString().padStart(2, '0')}:00`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Language Preference */}
        <div className="space-y-4">
          <h4 className="font-medium">Language Preference</h4>
          <FormField
            control={form.control}
            name="language_preference"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preferred language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
