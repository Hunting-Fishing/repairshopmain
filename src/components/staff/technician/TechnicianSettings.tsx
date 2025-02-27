
import { UseFormReturn } from "react-hook-form";
import { TechnicianFormValues } from "./hooks/useTechnicianForm";

interface TechnicianSettingsProps {
  form: UseFormReturn<TechnicianFormValues>;
}

export function TechnicianSettings({ form }: TechnicianSettingsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center text-muted-foreground py-8">
        Technician settings will be displayed here
      </div>
    </div>
  );
}
