
import { UseFormReturn } from "react-hook-form";

// Explicitly define the form values interface to match the one in TechnicianTabs
interface TechnicianSettingsFormValues {
  showTechnicianWorkload: boolean;
  showTechnicianAvailability: boolean;
  showTechnicianStats: boolean;
  enableAutoAssignment: boolean;
  enableTechnicianSpecialties: boolean;
  technicianScheduleConflictHandling: string;
  enableTechnicianColors: boolean;
  technicianViewMode: string;
  maxDailyBookings: number;
  preferredWorkTypes: string[];
  autoAssignmentPreferences: {
    considerSpecialties: boolean;
    considerWorkload: boolean;
    considerLocation: boolean;
  };
}

interface TechnicianSettingsProps {
  form: UseFormReturn<TechnicianSettingsFormValues>;
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
