import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { CalendarSettingsFormValues } from "./types";
import { ColorPalette } from "../ColorPalette";
import { useState } from "react";

interface AppearanceSettingsProps {
  form: UseFormReturn<CalendarSettingsFormValues>;
}

export function AppearanceSettings({ form }: AppearanceSettingsProps) {
  const [selectedColor, setSelectedColor] = useState("#9b87f5");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Theme</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="warm">Warm</SelectItem>
                  <SelectItem value="cool">Cool</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the overall appearance of your calendar
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Past Appointments Color</FormLabel>
          <ColorPalette selectedColor={selectedColor} onColorSelect={setSelectedColor} />
          <FormDescription>
            Choose how past appointments are displayed in the calendar
          </FormDescription>
        </FormItem>
      </CardContent>
    </Card>
  );
}