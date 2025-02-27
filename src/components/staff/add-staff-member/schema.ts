
import { z } from "zod";

export const staffMemberSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.string(),
  customRoleId: z.string().optional(),
  phoneNumber: z.string().optional(),
  hireDate: z.date().optional(),
  notes: z.string().optional(),
});

export type StaffMemberFormValues = z.infer<typeof staffMemberSchema>;
