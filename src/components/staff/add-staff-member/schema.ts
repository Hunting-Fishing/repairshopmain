
import { z } from "zod";

export const staffMemberSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(["technician", "service_advisor", "management", "parts", "hr", "custom"]),
  customRoleId: z.string().optional(),
  phoneNumber: z.string().optional(),
  hireDate: z.date().optional(),
  notes: z.string().optional(),
  schedule: z.object({
    monday: z.object({ start: z.string(), end: z.string() }).optional(),
    tuesday: z.object({ start: z.string(), end: z.string() }).optional(),
    wednesday: z.object({ start: z.string(), end: z.string() }).optional(),
    thursday: z.object({ start: z.string(), end: z.string() }).optional(),
    friday: z.object({ start: z.string(), end: z.string() }).optional(),
    saturday: z.object({ start: z.string(), end: z.string() }).optional(),
    sunday: z.object({ start: z.string(), end: z.string() }).optional(),
  }).optional(),
});

export type StaffMemberFormValues = z.infer<typeof staffMemberSchema>;
