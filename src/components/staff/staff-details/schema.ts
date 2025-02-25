
import { z } from "zod";

export const staffDetailsSchema = z.object({
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  email: z.string().email("Invalid email address").nullable(),
  phone_number: z.string().nullable(),
  notes: z.string().nullable(),
  emergency_contact: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    relationship: z.string().optional(),
  }).nullable(),
  skills: z.array(z.string())
});
