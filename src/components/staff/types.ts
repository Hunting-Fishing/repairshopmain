import { z } from "zod";

export const technicianSettingsFormSchema = z.object({
  showTechnicianWorkload: z.boolean(),
  showTechnicianAvailability: z.boolean(),
  showTechnicianStats: z.boolean(),
  enableAutoAssignment: z.boolean(),
  enableTechnicianSpecialties: z.boolean(),
  technicianScheduleConflictHandling: z.enum(["warn", "block", "allow"]),
  enableTechnicianColors: z.boolean(),
  technicianViewMode: z.enum(["individual", "combined", "filtered"]),
  maxDailyBookings: z.number().min(1).max(24),
  preferredWorkTypes: z.array(z.string()),
  autoAssignmentPreferences: z.object({
    considerSpecialties: z.boolean(),
    considerWorkload: z.boolean(),
    considerLocation: z.boolean(),
  }),
});

export type TechnicianSettingsFormValues = z.infer<typeof technicianSettingsFormSchema>;

export interface FormSectionProps {
  form: UseFormReturn<TechnicianSettingsFormValues>;
}