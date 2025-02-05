import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { technicianSettingsFormSchema, type TechnicianSettingsFormValues } from "../../types";

export function useTechnicianTabs() {
  const form = useForm<TechnicianSettingsFormValues>({
    resolver: zodResolver(technicianSettingsFormSchema),
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