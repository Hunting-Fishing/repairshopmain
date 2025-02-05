import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

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

export type StaffPermission = 
  | "manage_staff"
  | "view_staff"
  | "manage_roles"
  | "view_roles"
  | "manage_skills"
  | "view_skills"
  | "manage_training"
  | "view_training"
  | "manage_assignments"
  | "view_assignments";

export interface StaffRole {
  id: string;
  name: string;
  permissions: StaffPermission[];
}
