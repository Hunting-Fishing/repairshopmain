import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FormSectionProps } from "./types";
import { VisibilitySettings } from "./settings/VisibilitySettings";
import { AutoAssignmentSettings } from "./settings/AutoAssignmentSettings";
import { SchedulingSettings } from "./settings/SchedulingSettings";
import { DisplaySettings } from "./settings/DisplaySettings";

export function TechnicianSettings({ form }: FormSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Technician Management Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <VisibilitySettings form={form} />
        <Separator />
        <AutoAssignmentSettings form={form} />
        <Separator />
        <SchedulingSettings form={form} />
        <Separator />
        <DisplaySettings form={form} />
      </CardContent>
    </Card>
  );
}