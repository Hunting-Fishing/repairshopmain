
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SchedulingRules } from "./form-sections/SchedulingRules";
import { BufferSettings } from "./form-sections/BufferSettings";
import { FormSectionProps } from "./types";

export function SchedulingSettings({ form }: FormSectionProps) {
  return (
    <Card className="border-[#FEC6A1]">
      <CardHeader className="bg-[#FDE1D3] rounded-t-lg">
        <CardTitle>Scheduling Rules</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <SchedulingRules />
        <BufferSettings />
      </CardContent>
    </Card>
  );
}
