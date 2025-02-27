
import { useForm } from "react-hook-form";

export interface TechnicianFormValues {
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

export function useTechnicianForm() {
  const form = useForm<TechnicianFormValues>({
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
