import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { CalendarSettingsFormValues } from "./types";
import { SchedulingRules } from "./form-sections/SchedulingRules";
import { BufferSettings } from "./form-sections/BufferSettings";

interface SchedulingSettingsProps {
  form: UseFormReturn<CalendarSettingsFormValues>;
}

export function SchedulingSettings({ form }: SchedulingSettingsProps) {
  return (
    <Card className="border-[#FEC6A1]">
      <CardHeader className="bg-[#FDE1D3] rounded-t-lg">
        <CardTitle>Scheduling Rules</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <SchedulingRules form={form} />
        <BufferSettings form={form} />
      </CardContent>
    </Card>
  );
}