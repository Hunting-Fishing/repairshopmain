
import { FormSectionProps } from "../types";
import { TechnicianVisibilitySettings } from "./TechnicianVisibilitySettings";
import { TechnicianSchedulingSettings } from "./TechnicianSchedulingSettings";
import { TechnicianDisplaySettings } from "./TechnicianDisplaySettings";

export function TechnicianSettings({ form }: FormSectionProps) {
  return (
    <div className="space-y-6">
      <TechnicianVisibilitySettings form={form} />
      <TechnicianSchedulingSettings form={form} />
      <TechnicianDisplaySettings form={form} />
    </div>
  );
}
