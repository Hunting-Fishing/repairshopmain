
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

const colorPairSchema = z.tuple([z.string(), z.string()]);

type ColorPair = [string, string];

interface TechnicianColors {
  morningShift: ColorPair;
  dayShift: ColorPair;
  nightShift: ColorPair;
  foreman: ColorPair;
  apprentice: ColorPair;
  certified: ColorPair;
  lube: ColorPair;
  tires: ColorPair;
  diagnostic: ColorPair;
  general: ColorPair;
}

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
  technicianColors: z.object({
    morningShift: colorPairSchema,
    dayShift: colorPairSchema,
    nightShift: colorPairSchema,
    foreman: colorPairSchema,
    apprentice: colorPairSchema,
    certified: colorPairSchema,
    lube: colorPairSchema,
    tires: colorPairSchema,
    diagnostic: colorPairSchema,
    general: colorPairSchema,
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
