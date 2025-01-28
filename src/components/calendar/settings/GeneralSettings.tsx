import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { CalendarSettingsFormValues } from "./types";
import { GeneralViewSettings } from "./form-sections/GeneralViewSettings";
import { GeneralTimeSettings } from "./form-sections/GeneralTimeSettings";

interface GeneralSettingsProps {
  form: UseFormReturn<CalendarSettingsFormValues>;
}

export function GeneralSettings({ form }: GeneralSettingsProps) {
  return (
    <Card className="border-[#FEC6A1]">
      <CardHeader className="bg-[#FDE1D3] rounded-t-lg">
        <CardTitle>General Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <GeneralViewSettings form={form} />
        <GeneralTimeSettings form={form} />
      </CardContent>
    </Card>
  );
}