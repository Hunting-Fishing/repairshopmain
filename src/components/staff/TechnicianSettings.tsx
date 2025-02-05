import { FormSectionProps } from "./types";
import { VisibilitySettings } from "./settings/VisibilitySettings";
import { AutoAssignmentSettings } from "./settings/AutoAssignmentSettings";
import { SchedulingSettings } from "./settings/SchedulingSettings";
import { DisplaySettings } from "./settings/DisplaySettings";
import { TechnicianSpecialties } from "./TechnicianSpecialties";

export function TechnicianSettings({ form }: FormSectionProps) {
  return (
    <div className="space-y-6">
      <VisibilitySettings form={form} />
      <AutoAssignmentSettings form={form} />
      <SchedulingSettings form={form} />
      <DisplaySettings form={form} />
      <TechnicianSpecialties />
    </div>
  );
}