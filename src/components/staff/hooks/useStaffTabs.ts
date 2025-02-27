
import { useForm } from "react-hook-form";

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

export function useStaffTabs() {
  const form = useForm<TechnicianSettingsFormValues>({
    defaultValues: {
      showTechnicianWorkload: false,
      showTechnicianAvailability: false,
      showTechnicianStats: false,
      enableAutoAssignment: false,
      enableTechnicianSpecialties: false,
      technicianScheduleConflictHandling: "warn",
      enableTechnicianColors: false,
      technicianViewMode: "individual",
      maxDailyBookings: 8,
      preferredWorkTypes: [],
      autoAssignmentPreferences: {
        considerSpecialties: true,
        considerWorkload: true,
        considerLocation: false,
      },
    },
  });

  return form;
}
