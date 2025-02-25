
import { z } from "zod";

export const emergencyContactSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  relationship: z.string().optional(),
}).nullable();

export const staffDetailsSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(100).nullable(),
  last_name: z.string().min(1, "Last name is required").max(100).nullable(),
  email: z.string().email("Invalid email address").nullable(),
  phone_number: z.string().nullable(),
  notes: z.string().nullable(),
  emergency_contact: emergencyContactSchema,
  skills: z.array(z.string())
});

export type EmergencyContact = z.infer<typeof emergencyContactSchema>;
