import { UseFormReturn } from "react-hook-form";
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
});

export type TechnicianSettingsFormValues = z.infer<typeof technicianSettingsFormSchema>;

export interface FormSectionProps {
  form: UseFormReturn<TechnicianSettingsFormValues>;
}